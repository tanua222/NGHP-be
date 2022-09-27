import HierarchyWtnDao from '../../../dao/features/wtn/hierarchy-wtn.dao';
import { HierarchyNodeRequestParam } from '../../../domain/dto/haa-common.dto';
import HierarchyWtnDto from '../../../domain/dto/hierarchy-wtn.dto';
import { HierarchyWtnMap } from '../../../domain/dtoEntityMap/hierarchy-wtn.map';
import { HierarchyNodeQueryParams } from '../../../domain/entities/haa-query-param.entity';
import HierarchyWtnEntity from '../../../domain/entities/hierarchy-wtn.entity';
import Context from '../../../utils/context';
import { IvsConnection } from '../../../utils/database';
import HaaBaseGetService from '../../haa-base-get.service';
import HierarchyWtnValidatorService from '../../validator/features/wtn/hierarchy-wtn-validation.service';

export default class HierarchyWtnGetService extends HaaBaseGetService<HierarchyWtnDao> {
  conn: IvsConnection;

  constructor(context: Context) {
    super({ context, dao: new HierarchyWtnDao({ context }) });
  }

  mapEntityToDto(ivsEntity: HierarchyWtnEntity[]): HierarchyWtnDto[] {
    return HierarchyWtnMap.entityToDtoMapping(ivsEntity);
  }

  mapToEntityQueryParams(requestParam: HierarchyNodeRequestParam): any {
    let haaEntityQueryParams: HierarchyNodeQueryParams = super.mapToEntityQueryParams(requestParam);
    requestParam.nodeId && (haaEntityQueryParams.nodeId = requestParam.nodeId);
    return haaEntityQueryParams;
  }

  async validateInput(queryParams: HierarchyNodeQueryParams): Promise<void> {
    const validationService: HierarchyWtnValidatorService = new HierarchyWtnValidatorService(this.dao);
    await validationService.validateInputForGet(queryParams);
  }
}
