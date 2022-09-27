import Context from '../../../utils/context';
import { IvsConnection } from '../../../utils/database';
import HaaBasePatchService from '../../haa-base-patch.service';
import { HierarchyNodeRequestParam } from '../../../domain/dto/haa-common.dto';
import HaaQueryParams, { HierarchyNodeQueryParams } from '../../../domain/entities/haa-query-param.entity';
import HierarchyWtnDao from '../../../dao/features/wtn/hierarchy-wtn.dao';
import HierarchyWtnEntity from '../../../domain/entities/hierarchy-wtn.entity';
import { HierarchyWtnMap } from '../../../domain/dtoEntityMap/hierarchy-wtn.map';
import HierarchyWtnValidatorService from '../../validator/features/wtn/hierarchy-wtn-validation.service';

export default class HaaWtnPatchService extends HaaBasePatchService<HierarchyWtnDao> {
  conn: IvsConnection;

  constructor(context: Context) {
    super({ context, dao: new HierarchyWtnDao({ context }) });
  }

  mapDtoToEntity(requestParam: HierarchyNodeRequestParam): HierarchyWtnEntity[] {
    return [HierarchyWtnMap.dtoToEntityForUpdate(requestParam)];
  }

  async mapToEntityQueryParams(requestParam: HierarchyNodeRequestParam): Promise<HierarchyNodeQueryParams> {
    const queryParam = <HierarchyNodeQueryParams>await super.mapToEntityQueryParams(requestParam);
    queryParam.nodeId = requestParam.nodeId!;
    return queryParam;
  }

  async validateInput(queryParams: HierarchyNodeQueryParams): Promise<void> {
    const validationService: HierarchyWtnValidatorService = new HierarchyWtnValidatorService(this.dao);
    await validationService.validateInputForUpdate(queryParams);
  }
}
