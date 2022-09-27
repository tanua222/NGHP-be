import { SortParam } from '../dto/haa-common.dto';
import { HaaAssignableIdCodeSetDto } from '../dto/haa-id-code-set.dto';
import HaaIdCodeSetEntity from '../entities/haa-id-code-set.entity';

class HaaIdCodeSetMap {
  static dtoFieldToEntityFieldMapping: any = {
    entityNodeId: 'entityNodeId',
    parentHierarchyNodeId: 'hierarchyNodeId',
    entitySequenceId: 'entitySequenceId',
    idCodeSetCode: 'idCodeSetCode',
    idCodeSetName: 'idCodeSetDescription',
    idCodeSetDescription: 'idCodeSetDescription',
    idCodeSetLength: 'idCodeSetLength',
    parentHierarchyNodeName: 'hierarchyNodeName',
    parentHierarchyNodeLevel: 'hierarchyNodeLevel',
    parentNodeType: 'nodeType',
    entityId: 'entityId',
    effectiveDate: 'entityEffectiveDate',
  };

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
    //override by sub class
    return [];
  }
}

export class HaaAssignableIdCodeSetMap extends HaaIdCodeSetMap {
  static entityToDto(entities: HaaIdCodeSetEntity[]): HaaAssignableIdCodeSetDto[] {
    const dtos = entities.map((entity) => {
      const dto = new HaaAssignableIdCodeSetDto();
      dto.entitySequenceId = String(entity.entitySequenceId);
      dto.idCodeSetCode = entity.idCodeSetCode;
      dto.idCodeSetDescription = entity.idCodeSetDescription;
      dto.idCodeSetType = entity.idCodeSetType;
      dto.idCodeSetLength = entity.idCodeSetLength;
      dto.effectiveDate = entity.entityEffectiveDate;
      return dto;
    });
    return dtos;
  }

  static getDefaultSortParam(): SortParam[] {
    return [
      {
        fieldName: 'effectiveDate',
        asc: false,
      },
    ];
  }
}
