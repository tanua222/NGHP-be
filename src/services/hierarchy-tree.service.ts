import HierarchyTreeDao from '../dao/hierarchy-tree.dao';
import { HierarchyTreeRequestParam } from '../domain/dto/haa-common.dto';
import HierarchyTreeDto from '../domain/dto/hierarchy-tree.dto';
import ResponseDto from '../domain/dto/response.dto';
import { HierarchyTreeMap } from '../domain/dtoEntityMap/hierarchy-tree-map';
import { HierarchyTreeQueryParams } from '../domain/entities/haa-query-param.entity';
import HierarchyTreeNodeEntity from '../domain/entities/hierarchy-tree.entity';
import { ErrorMapping } from '../error/error-responses-mapping';
import { HIERARCHY_TREE_DEFAULT_VALUES } from '../utils/constants';
import Context from '../utils/context';
import HaaBaseService from './haa-base.service';

export default class HierarchyTreeService extends HaaBaseService<HierarchyTreeDao> {
  rootNtpId: number;
  canViewRoot: boolean;

  constructor(context: Context) {
    super({ context, dao: new HierarchyTreeDao({ context }) });
    this.rootNtpId = HIERARCHY_TREE_DEFAULT_VALUES.ROOT_NTP_ID;
    this.canViewRoot = false;
  }

  async executeTask(params: { params: HierarchyTreeRequestParam }): Promise<ResponseDto<any>> {
    try {
      const queryParam: HierarchyTreeQueryParams = this.mapToEntityQueryParam(params.params);
      const allNodes: HierarchyTreeNodeEntity[] = await this.getTreeByCorpId(queryParam);
      const filteredNodes: HierarchyTreeNodeEntity[] = await this.filterNodes(allNodes, queryParam);
      const dto: HierarchyTreeDto =
        filteredNodes.length > 0 ? this.mapEntityToDto(filteredNodes)[0] : new HierarchyTreeDto();
      let resDto = new ResponseDto<HierarchyTreeDto>();
      resDto.result = dto;
      return resDto;
    } catch (e) {
      this.log.error(`HierarchyTreeService.executeTask error: ${e}`);
      return ResponseDto.catchResponse(this.context, e);
    }
  }

  async getTreeByCorpId(queryParam: HierarchyTreeQueryParams) {
    const allNodes = await this.dao.getTreeByCorpId(queryParam);
    if (allNodes.length < 1) throw ResponseDto.notFoundError(this.context, {}, ErrorMapping.IVSHAA4419);
    return allNodes;
  }

  async getTreeWithMoveIndicator(queryParam: HierarchyTreeQueryParams, loginUserId: string) {
    const allNodes = await this.dao.getTreeWithMoveIndicator(queryParam, loginUserId);
    if (allNodes.length < 1) throw ResponseDto.notFoundError(this.context, {}, ErrorMapping.IVSHAA4419);
    return allNodes;
  }

  mapToEntityQueryParam(requestParam: HierarchyTreeRequestParam): HierarchyTreeQueryParams {
    let queryParam = new HierarchyTreeQueryParams();

    requestParam.corporationId && (queryParam.corporationId = requestParam.corporationId);
    requestParam.drillDownHierarchyNodeId &&
      (queryParam.drillDownHierarchyNodeId = requestParam.drillDownHierarchyNodeId);
    requestParam.startDate && (queryParam.startDate = requestParam.startDate);
    requestParam.endDate && (queryParam.endDate = requestParam.endDate);
    requestParam.maximumNodes && (queryParam.maximumNodes = requestParam.maximumNodes);
    requestParam.maximumLevels && (queryParam.maximumLevels = requestParam.maximumLevels);
    queryParam.includeWTN = requestParam.includeWTN ? requestParam.includeWTN : false;
    queryParam.loginUser = requestParam.loginUser;

    return queryParam;
  }

  mapEntityToDto(entities: HierarchyTreeNodeEntity[]): HierarchyTreeDto[] {
    return HierarchyTreeMap.entityToDtoMapping(entities, this.rootNtpId, this.canViewRoot);
  }

  private async filterNodes(
    allNodes: HierarchyTreeNodeEntity[],
    queryParam: HierarchyTreeQueryParams
  ): Promise<HierarchyTreeNodeEntity[]> {
    const rootNode = allNodes.find((node) => {
      if (queryParam.drillDownHierarchyNodeId) {
        if (node.id == queryParam.drillDownHierarchyNodeId) {
          this.rootNtpId = node.ntpId;
          return true;
        }
      } else {
        if (node.ntpId === this.rootNtpId) return true;
      }
    });
    if (!rootNode) throw `Cannot find root node`;
    const queryParamFilteredNodes = queryParam.drillDownHierarchyNodeId
      ? this.filterToPartialTree(allNodes, rootNode)
      : allNodes;
    const userCanViewPrivileges = await this.dao.getUserCanViewPrivileges(queryParam);
    let parentHierarchyIds: Set<string> = new Set<string>();
    let childHierarchyIds: Set<string> = new Set<string>();
    let addedNodes: Set<string> = new Set<string>();

    this.canViewRoot = userCanViewPrivileges.find((privilege) => {
      if (privilege.hnId == '2' || privilege.hnId == '3') {
        parentHierarchyIds.add(rootNode.id);
        return true;
      }
      if (privilege.hnId == rootNode.id && privilege.cascading === 'Y') {
        parentHierarchyIds.add(rootNode.id);
        return true;
      }
    })
      ? true
      : false;
    let privilegeFilteredNodes: HierarchyTreeNodeEntity[] = queryParamFilteredNodes.filter((node) => {
      if (node.nodeType == 'ROOT') {
        addedNodes.add(node.id);
        return true;
      }
      const privilegeFound = userCanViewPrivileges.find((privilege) => {
        if (privilege.hnId == node.id) {
          privilege.cascading == 'Y' && parentHierarchyIds.add(node.id);
          node.parentHierarchyId != '2' &&
            node.parentHierarchyId != '3' &&
            node.parentHierarchyId != rootNode.id &&
            childHierarchyIds.add(node.parentHierarchyId);
          addedNodes.add(node.id);
          return true;
        }
      });
      if (privilegeFound) return true;
      return false;
    });

    for (const id of parentHierarchyIds) {
      privilegeFilteredNodes = [
        ...privilegeFilteredNodes,
        ...queryParamFilteredNodes.filter((node) => {
          if (node.parentHierarchyId == id && !addedNodes.has(node.id)) {
            parentHierarchyIds.add(node.id);
            addedNodes.add(node.id);
            return true;
          }
          return false;
        }),
      ];
    }

    for (const id of childHierarchyIds) {
      privilegeFilteredNodes = [
        ...privilegeFilteredNodes,
        ...queryParamFilteredNodes.filter((node) => {
          if (node.id == id && !addedNodes.has(node.id)) {
            if (node.parentHierarchyId != '2' && node.parentHierarchyId != '3') {
              childHierarchyIds.add(node.parentHierarchyId);
              addedNodes.add(node.id);
              return true;
            }
          }
          return false;
        }),
      ];
    }
    return privilegeFilteredNodes;
  }

  private filterToPartialTree(
    tree: HierarchyTreeNodeEntity[],
    rootNode: HierarchyTreeNodeEntity
  ): HierarchyTreeNodeEntity[] {
    let parentHierarchyIds = new Set<string>();
    parentHierarchyIds.add(rootNode.id);
    let partialTree: HierarchyTreeNodeEntity[] = this.buildTree(parentHierarchyIds, tree);
    return [rootNode, ...partialTree];
  }

  private buildTree(parentHierarchyIds: Set<string>, data: HierarchyTreeNodeEntity[]) {
    let tree: HierarchyTreeNodeEntity[] = [];
    for (const id of parentHierarchyIds) {
      tree = [
        ...tree,
        ...data.filter((node) => {
          if (node.parentHierarchyId === id) {
            parentHierarchyIds.add(node.id);
            return true;
          }
          return false;
        }),
      ];
    }
    return tree;
  }
}
