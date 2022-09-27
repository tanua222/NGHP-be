import { BASE_CORP_NODE_LEVEL } from '../../utils/constants';
import HaaAssignedUserReportDto from '../dto/haa-assigned-user-report.dto';
import { SortParam } from '../dto/haa-common.dto';
import HaaAssignedUserReportEntity from '../entities/haa-assigned-user-report.entity';

export class HaaAssignedUserReportMap {
  static dtoFieldToEntityFieldMapping: any = {
    parentHierarchyNodeName: 'hierarchyNodeName',
    reportCode: 'reportCode',
    language: 'reportLanCode',
    reportDescription: 'reportDescription',
    parentHierarchyNodeLevel: 'hierarchyNodeLevel',
    recipientLoginName: 'recipientLoginName',
    format: 'formatCode',
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
    return [
      {
        fieldName: 'reportCode',
        asc: true,
      },
    ];
  }

  static entityToDto(entities: HaaAssignedUserReportEntity[]): HaaAssignedUserReportDto[] {
    if (!entities?.length) return [];

    return entities.map((entity) => {
      let dto = new HaaAssignedUserReportDto();
      dto.parentHierarchyNodeId = entity.hierarchyNodeId;
      dto.parentHierarchyNodeName = entity.hierarchyNodeName;
      dto.parentHierarchyNodeLevel = entity.hierarchyNodeLevel - BASE_CORP_NODE_LEVEL;
      dto.assignedReportId = entity.assignedReportId;
      dto.parentNodeType = entity.nodeType;
      dto.reportCode = entity.reportCode;
      dto.reportDescription = entity.reportDescription;
      dto.format = entity.formatCode;
      dto.language = entity.reportLanCode;
      dto.recipientLoginName = entity.recipientLoginName;
      dto.canUnassignIndicator = entity.canUnassignIndicator;

      return dto;
    });
  }
}
