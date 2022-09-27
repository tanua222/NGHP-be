import { BASE_CORP_NODE_LEVEL, HIERARCHY_TREE_DEFAULT_VALUES, NODE_TYPES } from '../../utils/constants';
import HierarchyTreeDto, { HierarchyTreeChildNodesDto } from '../dto/hierarchy-tree.dto';
import HierarchyTreeNodeEntity from '../entities/hierarchy-tree.entity';

export class HierarchyTreeMap {
  static entityToDtoMapping(
    entities: HierarchyTreeNodeEntity[],
    rootNtpId: number,
    canViewRoot: boolean
  ): HierarchyTreeDto[] {
    const dto = new HierarchyTreeDto();
    const root = entities.find((entity) => entity.ntpId === rootNtpId)!;
    dto.hierarchyNodeId = root.id;
    dto.hierarchyNodeName = root.ndeName;
    dto.hierarchyNodeLevel = root.ntpId - BASE_CORP_NODE_LEVEL;
    dto.nodeType = root.nodeType;
    dto.canViewIndicator = canViewRoot ? 1 : 0;
    const dwtnNode = entities.find((node) => node.nodeType == NODE_TYPES.DEFAULT_NODE);
    if (dwtnNode) {
      let dwtnNodeDto = this.setChildNodeInfo(entities, dwtnNode);
      dto.childNodes = [dwtnNodeDto, ...this.entityToChildDtoMapping(entities, root.id)];
    } else {
      dto.childNodes = this.entityToChildDtoMapping(entities, root.id);
    }
    return [dto];
  }

  static entityToChildDtoMapping(
    entities: HierarchyTreeNodeEntity[],
    parentHierarchyId: string
  ): HierarchyTreeChildNodesDto[] {
    return entities
      .filter((entity) => entity.parentHierarchyId === parentHierarchyId && entity.nodeType != NODE_TYPES.DEFAULT_NODE)
      .map((entity) => {
        return this.setChildNodeInfo(entities, entity);
      });
  }

  static setChildNodeInfo(
    entities: HierarchyTreeNodeEntity[],
    node: HierarchyTreeNodeEntity
  ): HierarchyTreeChildNodesDto {
    const childNodeDto = new HierarchyTreeChildNodesDto();
    childNodeDto.hierarchyNodeId = node.id;
    childNodeDto.hierarchyNodeName = node.ndeName;
    childNodeDto.hierarchyNodeLevel = node.ntpId - BASE_CORP_NODE_LEVEL;
    childNodeDto.nodeType = node.nodeType;
    childNodeDto.childNodes = this.entityToChildDtoMapping(entities, node.id);
    return childNodeDto;
  }
}
