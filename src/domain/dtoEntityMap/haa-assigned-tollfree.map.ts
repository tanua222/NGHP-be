import HaaAssignedTollfreeDto from '../dto/haa-assgined-tollfree.dto';
import { SortParam } from '../dto/haa-common.dto';
import HaaAssignedTollfreeEntity from '../entities/haa-assgined-tollfree.entity';

export class HaaAssignedTollfreeMap {
  static dtoFieldToEntityFieldMapping: any = {
    parentHierarchyNodeName: 'hierarchyNodeName',
    parentHierarchyNodeLevel: 'hierarchyNodeLevel',
    parentHierarchyNodeId: 'hierarchyNodeId',
    parentNodeType: 'nodeType',
    entityNodeId: 'entityNodeId',
    entitySequenceId: 'entitySequenceId',
    tollfreeNumber: 'tollfreeNumber',
    tollfreeVanityNumber: 'tollfreeVanityNumber',
    entityNodeEffectiveDate: 'entityEffectiveDate',
    entityId: 'entityId',
    canUnassignIndicator: 'canUnassignIndicator',
  };

  static entityToDto(entities: HaaAssignedTollfreeEntity[]): HaaAssignedTollfreeDto[] {
    const dtos = entities.map((entity) => {
      const dto = new HaaAssignedTollfreeDto();
      dto.entityNodeId = String(entity.entityNodeId);
      dto.parentHierarchyNodeId = String(entity.hierarchyNodeId);
      dto.entitySequenceId = String(entity.entitySequenceId);
      dto.entityId = entity.entityId;
      dto.tollfreeNumber = entity.tollfreeNumber;
      dto.tollfreeVanityNumber = entity.tollfreeVanityNumber;
      dto.entityNodeEffectiveDate = entity.entityEffectiveDate;
      dto.parentHierarchyNodeLevel = entity.hierarchyNodeLevel;
      dto.parentHierarchyNodeName = entity.hierarchyNodeName;
      dto.parentNodeType = entity.nodeType;
      dto.canUnassignIndicator = entity.canUnassignIndicator;
      return dto;
    });
    return dtos;
  }

  static mapDtoToEntitySortParams(sortParams: SortParam[]): SortParam[] {
    if (!sortParams.length) {
      sortParams = this.getDefaultSortParam();
    }
    const sortParamss: any[] = [];
    for (const sortParam of sortParams) {
      const entityField = this.dtoFieldToEntityFieldMapping[sortParam.fieldName];
      if (entityField) {
        sortParamss.push({ ...sortParam, fieldName: entityField });
      }
    }
    return sortParamss;
  }

  static getDefaultSortParam(): SortParam[] {
    return [
      {
        fieldName: 'entityNodeEffectiveDate',
        asc: false,
      },
    ];
  }
}
