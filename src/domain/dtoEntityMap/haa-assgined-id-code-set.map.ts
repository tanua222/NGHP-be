import HaaAssignedIdCodeSetDto from '../dto/haa-assgined-id-code-set.dto';
import { SortParam } from '../dto/haa-common.dto';
import HaaAssignedIdCodeSetEntity from '../entities/haa-assgined-id-code-set.entity';

export class HaaAssignedIdCodeSetMap {
  static dtoFieldToEntityFieldMapping: any = {
    parentHierarchyNodeName: 'hierarchyNodeName',
    parentHierarchyNodeLevel: 'hierarchyNodeLevel',
    parentHierarchyNodeId: 'hierarchyNodeId',
    parentNodeType: 'nodeType',
    entityNodeId: 'entityNodeId',
    entitySequenceId: 'entitySequenceId',
    idCodeSetCode: 'idCodeSetCode',
    idCodeSetDescription: 'idCodeSetDescription',
    idCodeSetType: 'idCodeSetType',
    idCodeSetLength: 'idCodeSetLength',
    entityNodeEffectiveDate: 'entityEffectiveDate',
    entityId: 'entityId',
    canUnassignIndicator: 'canUnassignIndicator',
  };

  static entityToDto(entities: HaaAssignedIdCodeSetEntity[]): HaaAssignedIdCodeSetDto[] {
    const dtos = entities.map((entity) => {
      const dto = new HaaAssignedIdCodeSetDto();
      dto.entityNodeId = String(entity.entityNodeId);
      dto.parentHierarchyNodeId = String(entity.hierarchyNodeId);
      dto.entitySequenceId = String(entity.entitySequenceId);
      dto.entityId = entity.entityId;
      dto.idCodeSetCode = entity.idCodeSetCode;
      dto.idCodeSetDescription = entity.idCodeSetDescription;
      dto.idCodeSetLength = entity.idCodeSetLength;
      dto.idCodeSetType = entity.idCodeSetType;
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
