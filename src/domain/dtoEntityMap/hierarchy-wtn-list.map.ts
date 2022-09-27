import { BASE_CORP_NODE_LEVEL } from '../../utils/constants';
import { SortParam } from '../dto/haa-common.dto';
import HierarchyWtnListDto from '../dto/hierarchy-wtn-list.dto';
import HierarchyWtnEntity from '../entities/hierarchy-wtn.entity';

export class HierarchyWtnListMap {
  static dtoFieldToEntityFieldMapping = new Map<string, string>([
    ['parentHierarchyNodeName', 'parentNodeName'],
    ['parentHierarchyNodeLevel', 'parentNtpId'],
    ['parentNodeType', 'parentNodeType'],
    ['workingTelephoneNumber', 'wtn'],
    ['billingTelephoneNumber', 'btn'],
    ['description', 'description1'],
    ['excludeFromReportCode', 'excludeFromReportsFlag'],
    ['effectiveDate', 'effectiveDate'],
  ]);

  static entityToDtoMapping(entities: HierarchyWtnEntity[]): HierarchyWtnListDto[] {
    return entities.map((entity) => {
      const dto = new HierarchyWtnListDto();
      dto.parentHierarchyNodeId = entity.parentHierarchyId;
      dto.parentHierarchyNodeName = entity.parentNodeName;
      dto.parentHierarchyNodeLevel = entity.parentNtpId - BASE_CORP_NODE_LEVEL;
      dto.parentNodeType = entity.parentNodeType;
      dto.wtnNodeId = entity.id;
      dto.workingTelephoneNumber = entity.wtn;
      dto.billingTelephoneNumber = entity.btn;
      dto.excludeFromReportCode = entity.excludeFromReportsFlag;
      dto.description = entity.description1;
      dto.effectiveDate = entity.effectiveDate;
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
    sortParam.fieldName = 'parentNtpId';
    sortParam.asc = true;
    return [sortParam];
  }
}
