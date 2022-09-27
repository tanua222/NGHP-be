import { BASE_CORP_NODE_LEVEL } from '../../utils/constants';
import { SortParam } from '../dto/haa-common.dto';
import HierarchyNodeListDto from '../dto/hierarchy-node-list.dto';
import HierarchyNodeEntity from '../entities/hierarchy-node.entity';

export class HierarchyNodeListMap {
  static dtoFieldToEntityFieldMapping = new Map<string, string>([
    ['nodeName', 'name'],
    ['hierarchyNodeLevel', 'ntpId'],
    ['effectiveDate', 'effectiveDate'],
    ['description', 'description1'],
    ['parentHierarchyNodeName', 'parentHierarchyNodeName'],
    ['parentHierarchyNodeLevel', 'parentHierarchyNodeLevel'],
    ['parentNodeType', 'parentNodeType'],
  ]);

  static entityToDtoMapping(entities: HierarchyNodeEntity[]): HierarchyNodeListDto[] {
    return entities.map((entity) => {
      const dto = new HierarchyNodeListDto();
      dto.nodeId = entity.ndeId;
      dto.nodeName = entity.name;
      dto.nodeType = entity.nodeType;
      dto.hierarchyNodeLevel = entity.ntpId - BASE_CORP_NODE_LEVEL;
      dto.effectiveDate = entity.effectiveDate;
      dto.description = entity.description1;
      dto.parentHierarchyNodeId = entity.parentHierarchyId;
      dto.parentHierarchyNodeName = entity.parentHierarchyNodeName;
      dto.parentHierarchyNodeLevel = entity.parentHierarchyNodeLevel - BASE_CORP_NODE_LEVEL;
      dto.parentNodeType = entity.parentHierarchyNodeType;
      dto.canMoveIndicator = entity.canMoveIndicator;
      dto.canViewIndicator = entity.canViewIndicator;
      return dto;
    });
  }

  static mapDtoToEntitySortParams(sortParams: SortParam[]): SortParam[] {
    if (!sortParams?.length) return this.getDefaultSortParam();
    return sortParams.map((s1) => {
      return { ...s1, fieldName: this.dtoFieldToEntityFieldMapping.get(s1.fieldName) || s1.fieldName };
    });
  }

  static getDefaultSortParam(): SortParam[] {
    const sortParam = new SortParam();
    sortParam.fieldName = 'ntpId';
    sortParam.asc = true;
    return [sortParam];
  }
}
