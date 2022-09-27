import HierarchyWtnListDao from '../../../dao/features/wtn/hierarchy-wtn-list.dao';
import { HierarchyNodeRequestParam, RequestParam, SortParam } from '../../../domain/dto/haa-common.dto';
import HierarchyWtnListDto from '../../../domain/dto/hierarchy-wtn-list.dto';
import { HierarchyWtnListMap } from '../../../domain/dtoEntityMap/hierarchy-wtn-list.map';
import { HierarchyNodeQueryParams } from '../../../domain/entities/haa-query-param.entity';
import HierarchyWtnEntity from '../../../domain/entities/hierarchy-wtn.entity';
import Context from '../../../utils/context';
import HaaBaseGetService from '../../haa-base-get.service';
import HierarchyWtnValidatorService from '../../validator/features/wtn/hierarchy-wtn-validation.service';

export default class HierarchyWtnListGetService extends HaaBaseGetService<HierarchyWtnListDao> {
  permissionDescriptions: string[];

  constructor(context: Context) {
    super({ context, dao: new HierarchyWtnListDao({ context }) });
    this.permissionDescriptions = ['VIEW-NODE'];
  }

  isPaginationRequired(requestParam?: RequestParam): boolean {
    return true;
  }

  mapEntityToDto(ivsEntity: HierarchyWtnEntity[]): HierarchyWtnListDto[] {
    return HierarchyWtnListMap.entityToDtoMapping(ivsEntity);
  }

  getDtoToEntitySortParams(sortParams: SortParam[]): SortParam[] {
    return HierarchyWtnListMap.mapDtoToEntitySortParams(sortParams);
  }

  mapToEntityQueryParams(requestParam: HierarchyNodeRequestParam): any {
    let haaEntityQueryParams: HierarchyNodeQueryParams = super.mapToEntityQueryParams(requestParam);
    requestParam.parentHierarchyNodeName &&
      (haaEntityQueryParams.parentHierarchyNodeName = requestParam.parentHierarchyNodeName.toLowerCase());
    requestParam.hierarchyNodeLevel && (haaEntityQueryParams.hierarchyNodeLevel = requestParam.hierarchyNodeLevel);
    requestParam.workingTelephoneNumber &&
      (haaEntityQueryParams.workingTelephoneNumber = requestParam.workingTelephoneNumber);
    requestParam.billingTelephoneNumber &&
      (haaEntityQueryParams.billingTelephoneNumber = requestParam.billingTelephoneNumber);
    requestParam.parentHierarchyNodeId &&
      (haaEntityQueryParams.parentHierarchyNodeId = requestParam.parentHierarchyNodeId);
    requestParam.parentHierarchyNodeLevel &&
      (haaEntityQueryParams.parentHierarchyNodeLevel = Number(requestParam.parentHierarchyNodeLevel));
    requestParam.excludeFromReportCode &&
      (haaEntityQueryParams.excludeFromReportsFlag = requestParam.excludeFromReportCode);

    haaEntityQueryParams.loginUser = this.context.uuid;
    haaEntityQueryParams.permissionDescription = this.permissionDescriptions;
    return haaEntityQueryParams;
  }

  isArray(): boolean {
    return true;
  }

  async validateInput(queryParams: HierarchyNodeQueryParams): Promise<void> {
    const validationService: HierarchyWtnValidatorService = new HierarchyWtnValidatorService(this.dao);
    await validationService.validateInputForGetList(queryParams);
  }

  addLoginUserIdParam(): boolean {
    return true;
  }
}
