import { SortParam } from '../dto/haa-common.dto';
import HaaExtractDto from '../dto/haa-extract.dto';
import HaaExtractEntity from '../entities/haa-extract.entity';

export class HaaExtractListMap {
  static dtoFieldToEntityFieldMapping: any = {
    extractId: 'extractId',
    hierarchyNodeName: 'nodeName',
    updateDate: 'updateDate',
    status: 'status',
    extractFileName: 'extractFileName',
  };

  static entityToDto(entities: HaaExtractEntity[]): HaaExtractDto[] {
    const dtos = entities.map((entity) => {
      const dto = new HaaExtractDto();
      dto.extractId = String(entity.extractId);
      dto.hierarchyNodeName = entity.nodeName;
      dto.message = entity.message;
      dto.status = entity.status;
      dto.updateDate = entity.updateDate;
      dto.extractFileName = entity.extractFileName;
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
        fieldName: 'updateDate',
        asc: false,
      },
    ];
  }
}
