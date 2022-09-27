import HaaExtractsDao from '../../../dao/features/extracts/haa-extracts.dao';
import { RequestParam } from '../../../domain/dto/haa-common.dto';
import { HaaExtractsQueryParams } from '../../../domain/entities/haa-query-param.entity';
import Context from '../../../utils/context';
import HaaBaseDeleteService from '../../haa-base-delete.service';
import HaaExtractsValidatorService from '../../validator/features/extracts/haa-extracts-validation.service';

export default class HaaExtractDeleteService extends HaaBaseDeleteService<HaaExtractsDao> {
  constructor(context: Context) {
    super({ context, dao: new HaaExtractsDao({ context }) });
  }

  async mapToEntityQueryParams(requestParam: RequestParam): Promise<HaaExtractsQueryParams> {
    const queryParam: HaaExtractsQueryParams = new HaaExtractsQueryParams();
    requestParam.entityIdsToDelete?.length && (queryParam.extractId = requestParam.entityIdsToDelete[0]);
    return queryParam;
  }

  async validateInput(queryParams: HaaExtractsQueryParams): Promise<void> {
    const validationService: HaaExtractsValidatorService = new HaaExtractsValidatorService(this.dao);
    await validationService.validateIfUserPermitted(parseInt(queryParams.extractId));
  }
}
