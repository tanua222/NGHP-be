import HierarchyWtnDao from '../../../dao/features/wtn/hierarchy-wtn.dao';
import { HierarchyNodeRequestParam } from '../../../domain/dto/haa-common.dto';
import { HierarchyNodeQueryParams } from '../../../domain/entities/haa-query-param.entity';
import Context from '../../../utils/context';
import HaaBaseDeleteService from '../../haa-base-delete.service';
import HierarchyWtnValidatorService from '../../validator/features/wtn/hierarchy-wtn-validation.service';

export default class HierarchyWtnRemoveService extends HaaBaseDeleteService<HierarchyWtnDao> {
  constructor(context: Context) {
    super({ context, dao: new HierarchyWtnDao({ context }) });
  }

  async mapToEntityQueryParams(requestParam: HierarchyNodeRequestParam): Promise<HierarchyNodeQueryParams> {
    const queryParam: HierarchyNodeQueryParams = <HierarchyNodeQueryParams>(
      this.mapToEntityQueryParamsCommon(requestParam)
    );
    requestParam.nodeId && (queryParam.nodeId = requestParam.nodeId);
    return queryParam;
  }

  async validateInput(queryParams: HierarchyNodeQueryParams): Promise<void> {
    const validationService: HierarchyWtnValidatorService = new HierarchyWtnValidatorService(this.dao);
    await validationService.validateInputForDelete(queryParams);
  }
}
