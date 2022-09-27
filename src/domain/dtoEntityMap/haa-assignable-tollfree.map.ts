import HaaAssignableTollfreeDto from '../dto/haa-assignable-tollfree.dto';
import { SortParam } from '../dto/haa-common.dto';
import HaaAssignableTollfreeEntity from '../entities/haa-assignable-tollfree.entity';

export class HaaAssignableTollfreeMap {
  static dtoFieldToEntityFieldMapping: any = {
    tollfreeNumber: 'tollfreeNumber',
    tollfreeVanityNumber: 'tollfreeVanityNumber',
  };

  static entityToDto(entities: HaaAssignableTollfreeEntity[]): HaaAssignableTollfreeDto[] {
    const dtos = entities.map((entity) => {
      const dto = new HaaAssignableTollfreeDto();
      dto.entitySequenceId = entity.entitySequenceId;
      dto.tollfreeNumber = entity.tollfreeNumber;
      dto.tollfreeVanityNumber = entity.tollfreeVanityNumber;
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
        fieldName: 'tollfreeNumber',
        asc: true,
      },
    ];
  }
}
