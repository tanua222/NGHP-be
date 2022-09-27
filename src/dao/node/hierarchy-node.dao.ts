import PaginationResult from '../../domain/dto/pagination-result.dto';
import CerptNodeEntity from '../../domain/entities/cerpt-node.entity';
import { HierarchyNodeQueryParams, HierarchyTreeQueryParams } from '../../domain/entities/haa-query-param.entity';
import HierarchyNodeEntity from '../../domain/entities/hierarchy-node.entity';
import { HierarchyNodeDBErrorMapping } from '../../error/database/features/hierarchy-node-db-error-mapping';
import { IvsConnection } from '../../utils/database';
import { BaseDaoOptions } from '../base.dao';
import HaaBaseDao from '../haa-base.dao';
import HaaQueryParams from '../../domain/entities/haa-query-param.entity';
import ResponseDto from '../../domain/dto/response.dto';
import { ErrorMapping } from '../../error/error-responses-mapping';
import HierarchyTreeService from '../../services/hierarchy-tree.service';
import HierarchyTreeNodeEntity from '../../domain/entities/hierarchy-tree.entity';
import HaaAssignedUserReportService from '../../services/features/reports/haa-assigned-user-report.service';
import HaaUserReportDao from '../features/reports/haa-user-report.dao';
import HaaEntityDao from '../features/entities/haa-entity.dao';
import HaaUserRoleMgtDao from '../features/haa-user-role-mgt.dao';
import CerptUsersDao from '../cerpt-users.dao';
import { isDataUpdated } from '../../utils/util';

export default class HierarchyNodeDao extends HaaBaseDao {
  haaAssignedUserReportService: HaaAssignedUserReportService;
  hierarchyTreeService: HierarchyTreeService;
  haaUserReportDao: HaaUserReportDao;
  haaEntityDao: HaaEntityDao;
  haaUserRoleMgtDao: HaaUserRoleMgtDao;

  constructor(options: BaseDaoOptions) {
    super({ mapperNamespace: 'cerptNodeMapper', ...options });
    this.dbErrorMap = HierarchyNodeDBErrorMapping;
    this.haaAssignedUserReportService = new HaaAssignedUserReportService(this.context);
    this.hierarchyTreeService = new HierarchyTreeService(this.context);
    this.haaUserReportDao = new HaaUserReportDao({ context: this.context });
    this.haaEntityDao = new HaaEntityDao({ context: this.context });
    this.haaUserRoleMgtDao = new HaaUserRoleMgtDao({ context: this.context });
  }

  mapDbResultToEntity(results: any): CerptNodeEntity[] {
    return CerptNodeEntity.transform(results);
  }

  async createDbEntitiesByParams(queryParam: HierarchyNodeQueryParams, conn: IvsConnection) {
    const nextNodeId = await this.getSingleValue({
      query: 'getNextNodeId',
      alias: 'SEQ_NUM',
      mapperNamespace: 'cerptNodeMapper',
    });
    await this.createNodeEntity(queryParam, conn, nextNodeId);
    await this.createHierarchyNodeEntity(queryParam, conn, nextNodeId);

    const craetedEntries = this.entitiesToReturnForCreate(queryParam);
    const paginationResult: PaginationResult = this.preparePaginationResultForCreate(queryParam, craetedEntries);
    return paginationResult;
  }

  async createNodeEntity(queryParam: HierarchyNodeQueryParams, conn: IvsConnection, nextNodeId: string) {
    const nodeEntity = this.nodeEntityToCreate(queryParam);
    const nodeParams = {
      ...nodeEntity,
      parentHierarchyNodeId: queryParam.parentHierarchyNodeId,
      id: nextNodeId,
      loginUser: queryParam.loginUser,
    };
    await this.add({ query: 'addNode', params: nodeParams, connection: conn, mapperNamespace: 'cerptNodeMapper' });
  }

  async createHierarchyNodeEntity(
    queryParam: HierarchyNodeQueryParams,
    conn: IvsConnection,
    nextNodeId: string
  ): Promise<number> {
    const nextHierarchyNodeId = await this.getSingleValue({
      query: 'getNextHierarchyNodeId',
      alias: 'SEQ_NUM',
      mapperNamespace: 'hierarchyNodeMapper',
    });
    const hierartchyNodeEntity = await this.hierarchyNodeEntityToCreate(queryParam);
    const hierarchyNodeParams = {
      ...hierartchyNodeEntity,
      id: nextHierarchyNodeId,
      ndeId: nextNodeId,
      loginUser: queryParam.loginUser,
      parentHierarchyNodeId: queryParam.parentHierarchyNodeId,
    };
    await this.add({
      query: 'addHierarchyChildNode',
      params: hierarchyNodeParams,
      connection: conn,
      mapperNamespace: 'hierarchyNodeMapper',
    });
    return nextHierarchyNodeId;
  }

  nodeEntityToCreate(queryParam: HierarchyNodeQueryParams): CerptNodeEntity {
    const queryEntity: CerptNodeEntity = <CerptNodeEntity>queryParam.entities[0];
    const entity = new CerptNodeEntity();
    entity.name = queryEntity.name;
    entity.description1 = queryEntity.description1?.trim() || null;
    entity.description2 = queryEntity.description2?.trim() || null;
    entity.description3 = queryEntity.description3?.trim() || null;
    entity.reportingFlag = queryEntity.excludeFromReportsFlag || 'N';
    entity.nodeType = queryParam.nodeType;
    entity.wtn = queryEntity.wtn || null;
    entity.wtnType = queryEntity.wtnType || null;
    return entity;
  }

  async hierarchyNodeEntityToCreate(queryParam: HierarchyNodeQueryParams): Promise<HierarchyNodeEntity> {
    const queryEntity: CerptNodeEntity = <CerptNodeEntity>queryParam.entities[0];
    const entity = new HierarchyNodeEntity();
    entity.name = queryEntity.name;
    return entity;
  }

  async updateDbEntitiesByParams(queryParam: HierarchyNodeQueryParams, conn: IvsConnection) {
    const updateEntity = <CerptNodeEntity>queryParam.entities[0];
    const nodeParams = {
      nodeName: updateEntity.name,
      description1: updateEntity.description1,
      description2: updateEntity.description2,
      description3: updateEntity.description3,
      loginUser: queryParam.loginUser,
      nodeId: queryParam.nodeId,
    };
    await this.update({ params: nodeParams, connection: conn, mapperNamespace: 'cerptNodeMapper' });

    const hierarchyNodeParams = {
      nodeId: queryParam.nodeId,
      nodeName: updateEntity.name,
      loginUser: queryParam.loginUser,
    };
    await this.update({
      query: 'updateRecordById',
      params: hierarchyNodeParams,
      connection: conn,
      mapperNamespace: 'hierarchyNodeMapper',
    });

    const paginationResult: PaginationResult = new PaginationResult();

    return paginationResult;
  }

  async deleteDbEntitiesByParams(queryParam: HierarchyNodeQueryParams, conn: IvsConnection) {
    const param = {
      nodeId: queryParam.nodeId,
      loginUser: queryParam.loginUser,
    };
    await this.findByFilters({
      query: 'deleteRecord',
      params: param,
      connection: conn,
      mapperNamespace: 'hierarchyNodeMapper',
    });
    await this.findByFilters({
      query: 'deleteRecord',
      params: param,
      connection: conn,
      mapperNamespace: 'cerptNodeMapper',
    });

    const paginationResult: PaginationResult = new PaginationResult();

    return paginationResult;
  }

  async findHierarchyNodeByParams(args: any): Promise<HierarchyNodeEntity[]> {
    const param = {
      ...args,
    };

    const dbResult = await this.findByFilters({
      query: 'findByParams',
      params: param,
      mapperNamespace: 'hierarchyNodeMapper',
    });

    return HierarchyNodeEntity.transform(dbResult);
  }

  async findNodeByParams(args: any): Promise<CerptNodeEntity[]> {
    const param = {
      ...args,
    };

    const dbResult = await this.findByFilters({
      query: 'findByParams',
      params: param,
      mapperNamespace: 'cerptNodeMapper',
    });

    return CerptNodeEntity.transform(dbResult);
  }

  async getUserId(loginUser: string) {
    if (loginUser) {
      return await new CerptUsersDao({ context: this.context }).getSingleValue({
        mapperNamespace: 'cerptUsersMapper',
        alias: 'ID',
        params: { loginUser: loginUser },
      });
    }
    return null;
  }

  async addEndDate(args: any, conn: IvsConnection): Promise<any> {
    const param = {
      ...args,
    };

    return await this.update({
      query: 'addEndDate',
      params: param,
      mapperNamespace: 'hierarchyNodeMapper',
      connection: conn,
    });
  }

  async moveNode(params: HaaQueryParams, connection?: IvsConnection) {
    if (connection) {
      const entities = <HierarchyNodeEntity[]>params.entities;
      const loginUserId = await this.getUserId(params.loginUser);

      for await (const entity of entities) {
        let filteredNodes: HierarchyTreeNodeEntity[] = [];
        let inputNodes: HierarchyTreeNodeEntity[] = [];
        const targetParentHierarchyId = entity.parentHierarchyId;
        const hierarchyNodes = await this.findHierarchyNodeByParams({ nodeId: entity.ndeId });
        const node = hierarchyNodes?.[0];
        if (node) {
          if (node.parentHierarchyId === targetParentHierarchyId || node.id === targetParentHierarchyId) {
            throw ResponseDto.internalErrorCode(this.context, ErrorMapping.IVSHAA4424);
          }

          const hTreeParams = new HierarchyTreeQueryParams();
          hTreeParams.corporationId = +node.corpId;
          hTreeParams.includeWTN = true;
          hTreeParams.drillDownHierarchyNodeId = node.id;
          if (!this.isExternalUser) {
            const allNodes = await this.hierarchyTreeService.getTreeByCorpId(hTreeParams);
            const inputNode = allNodes.find((n) => n.ndeId === entity.ndeId)!;
            filteredNodes = this.filterNodes(allNodes, inputNode);
            inputNodes = [inputNode];
          } else {
            const allNodes = await this.hierarchyTreeService.getTreeWithMoveIndicator(hTreeParams, loginUserId);
            const inputNode = allNodes.find((n) => n.ndeId === entity.ndeId)!;
            filteredNodes = this.filterNodes(allNodes, inputNode);
            inputNodes = [inputNode];

            const node = filteredNodes.find((node) => node.canMoveIndicator === 'N');
            if (node) {
              throw ResponseDto.internalErrorCode(this.context, ErrorMapping.IVSHAA4432);
            }
          }
          const childNode = filteredNodes.find((n) => n.id === targetParentHierarchyId);
          if (childNode) {
            throw ResponseDto.internalErrorCode(this.context, ErrorMapping.IVSHAA4434);
          }

          await this.updateChildNodes(filteredNodes, inputNodes, params.loginUser, connection, targetParentHierarchyId);
        }
      }
    }
  }

  private filterNodes(nodes: HierarchyTreeNodeEntity[], rootNode: HierarchyTreeNodeEntity) {
    let parentHierarchyIds = new Set<string>();
    parentHierarchyIds.add(rootNode.id);
    let partialTree: HierarchyTreeNodeEntity[] = this.buildTree(parentHierarchyIds, nodes);
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

  private async updateChildNodes(
    allNodes: HierarchyTreeNodeEntity[],
    nodes: HierarchyTreeNodeEntity[],
    loginUser: string,
    conn: IvsConnection,
    targetParentHierarchyNodeId: string
  ) {
    for await (const node of nodes) {
      if (node.nodeType === 'WTN') {
        // delete chn
        await this.findByFilters({
          query: 'deleteRecord',
          params: { nodeId: node.ndeId },
          connection: conn,
          mapperNamespace: 'hierarchyNodeMapper',
        });
      } else {
        // end dated chn
        let rows = await this.addEndDate(
          {
            loginUser,
            hierarchyNodeId: node.id,
          },
          conn
        );
        if (!isDataUpdated(rows)) throw ResponseDto.internalErrorCode(this.context, ErrorMapping.IVSHAA4436);
      }
      // create new chn
      const cerptNodeParams = new CerptNodeEntity();
      cerptNodeParams.name = node.ndeName;
      const createParams = new HierarchyNodeQueryParams();
      createParams.loginUser = loginUser;
      createParams.parentHierarchyNodeId = targetParentHierarchyNodeId;
      createParams.entities = [cerptNodeParams];
      const createdHierarchyNodeId = await this.createHierarchyNodeEntity(createParams, conn, node.ndeId);

      await this.updateReports(node.id, createdHierarchyNodeId, loginUser, conn);
      await this.updateNodeEntities(node.id, createdHierarchyNodeId, conn);
      await this.updateUserRoles(node.id, createdHierarchyNodeId, conn);

      const hierarchyNodes = allNodes.filter((n) => n.parentHierarchyId === node.id);
      if (hierarchyNodes.length) {
        await this.updateChildNodes(allNodes, hierarchyNodes, loginUser, conn, createdHierarchyNodeId.toString());
      }
    }
  }

  private async updateReports(parentHnId: string, targetHndeId: number, loginUser: string, conn: IvsConnection) {
    const movedRows = await this.haaUserReportDao.moveUserReport(
      {
        parentHnId,
        targetHndeId,
        loginUser,
      },
      conn
    );
    const unassignedRows = await this.haaUserReportDao.unassignUserReport(
      {
        parentHnId,
      },
      conn
    );

    if (!isDataUpdated(unassignedRows, movedRows.rowsAffected))
      throw ResponseDto.internalErrorCode(this.context, ErrorMapping.IVSHAA4436);
  }

  private async updateNodeEntities(parentHnId: string, targetHndeId: number, conn: IvsConnection) {
    const movedRows = await this.haaEntityDao.moveNodeEntities(
      {
        parentHnId,
        targetHndeId,
      },
      conn
    );
    const unassignedRows = await this.haaEntityDao.unassign(
      {
        parentHnId,
      },
      conn
    );

    if (!isDataUpdated(unassignedRows, movedRows.rowsAffected))
      throw ResponseDto.internalErrorCode(this.context, ErrorMapping.IVSHAA4436);
  }

  private async updateUserRoles(parentHnId: string, targetHndeId: number, conn: IvsConnection) {
    await this.haaUserRoleMgtDao.moveUserRoles(
      {
        parentHnId,
        targetHndeId,
      },
      conn
    );
  }
}
