import {
  HaaAssignableAccountCodeSetDto,
  HaaAssignedAccountCodeSetDto,
  HaaAssignAccountCodeSetDto,
} from '../dto/haa-account-code-set.dto';
import { SortParam } from '../dto/haa-common.dto';
import { HaaAccountCodeSetEntity, HaaAssignAccountCodeSetEntity } from '../entities/haa-account-code-set.entity';
import { AssignAccountCodeSetRequestParam } from '../../domain/dto/haa-common.dto';

class HaaAccountCodeSetMap {
  static dtoFieldToEntityFieldMapping: any = {
    entityNodeId: 'entityNodeId',
    parentHierarchyNodeId: 'hierarchyNodeId',
    entitySequenceId: 'entitySequenceId',
    accountCodeSetCode: 'accountCodeSetCode',
    accountCodeSetName: 'accountCodeSetDescription',
    accountCodeSetDescription: 'accountCodeSetDescription',
    accountCodeSetLength: 'accountCodeSetLength',
    parentHierarchyNodeName: 'hierarchyNodeName',
    parentHierarchyNodeLevel: 'hierarchyNodeLevel',
    parentNodeType: 'nodeType',
    entityId: 'entityId',
    entityNodeEffectiveDate: 'entityEffectiveDate', //getAssgined
    effectiveDate: 'entityEffectiveDate', //getAssignable
    canUnassignIndicator: 'canUnassignIndicator',
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

export class HaaAssignableAccountCodeSetMap extends HaaAccountCodeSetMap {
  static entityToDto(entities: HaaAccountCodeSetEntity[]): HaaAssignableAccountCodeSetDto[] {
    const dtos = entities.map((entity) => {
      const dto = new HaaAssignableAccountCodeSetDto();
      dto.entitySequenceId = String(entity.entitySequenceId);
      dto.accountCodeSetCode = entity.accountCodeSetCode;
      dto.accountCodeSetDescription = entity.accountCodeSetDescription;
      dto.accountCodeSetLength = entity.accountCodeSetLength;
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

export class HaaAssignedAccountCodeSetMap extends HaaAccountCodeSetMap {
  static entityToDto(entities: HaaAccountCodeSetEntity[]): HaaAssignedAccountCodeSetDto[] {
    const dtos = entities.map((entity) => {
      const dto = new HaaAssignedAccountCodeSetDto();
      dto.entityNodeId = String(entity.entityNodeId);
      dto.parentHierarchyNodeId = String(entity.hierarchyNodeId);
      dto.entitySequenceId = String(entity.entitySequenceId);
      dto.entityId = entity.entityId;
      dto.accountCodeSetCode = entity.accountCodeSetCode;
      dto.accountCodeSetName = entity.accountCodeSetDescription;
      dto.accountCodeSetLength = entity.accountCodeSetLength;
      dto.entityNodeEffectiveDate = entity.entityEffectiveDate;
      dto.parentHierarchyNodeLevel = entity.hierarchyNodeLevel;
      dto.parentHierarchyNodeName = entity.hierarchyNodeName;
      dto.parentNodeType = entity.nodeType;
      dto.canUnassignIndicator = entity.canUnassignIndicator;
      return dto;
    });
    return dtos;
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

export class HaaAssignAccountCodeSetMap {
  static entityToDtoMapping(entities: HaaAssignAccountCodeSetEntity[]): HaaAssignAccountCodeSetDto[] {
    let dtos: HaaAssignAccountCodeSetDto[] = [];
    entities.map((entity) => {
      const dto = new HaaAssignAccountCodeSetDto();
      entity.entitySequenceId && (dto.entitySequenceId = String(entity.entitySequenceId));
      entity.parentHierarchyNodeId && (dto.parentHierarchyNodeId = String(entity.parentHierarchyNodeId));
      dtos.push(dto);
    });
    return dtos;
  }

  static dtoToEntityForCreate(requestParam: AssignAccountCodeSetRequestParam): HaaAssignAccountCodeSetEntity[] {
    let entities: HaaAssignAccountCodeSetEntity[] = [];
    requestParam.inputRequest.map((dto: HaaAssignAccountCodeSetDto) => {
      let entity = new HaaAssignAccountCodeSetEntity();
      dto.parentHierarchyNodeId && (entity.parentHierarchyNodeId = Number(dto.parentHierarchyNodeId));
      dto.entitySequenceId && (entity.entitySequenceId = dto.entitySequenceId);
    });
    return entities;
  }
}
