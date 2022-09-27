import HierarchyNodeDao from '../../dao/node/hierarchy-node.dao';
import { HierarchyNodeRequestParam } from '../../domain/dto/haa-common.dto';
import { HierarchyNodeQueryParams } from '../../domain/entities/haa-query-param.entity';
import Context from '../../utils/context';
import HaaBaseDeleteService from '../haa-base-delete.service';
import HierarchyNodeValidatorService from '../validator/nodes/hierarchy-node-validation.service';

export default class HierarchyNodeRemoveService extends HaaBaseDeleteService<HierarchyNodeDao> {
  constructor(context: Context) {
    super({ context, dao: new HierarchyNodeDao({ context }) });
  }

  async mapToEntityQueryParams(requestParam: HierarchyNodeRequestParam): Promise<HierarchyNodeQueryParams> {
    const queryParam: HierarchyNodeQueryParams = <HierarchyNodeQueryParams>(
      this.mapToEntityQueryParamsCommon(requestParam)
    );
    requestParam.nodeId && (queryParam.nodeId = requestParam.nodeId);
    return queryParam;
  }

  async validateInput(queryParams: HierarchyNodeQueryParams) {
    const validationService: HierarchyNodeValidatorService = new HierarchyNodeValidatorService(this.dao);
    await validationService.validateInputForDelete(queryParams);
  }
}
