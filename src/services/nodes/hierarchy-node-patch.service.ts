import HierarchyNodeDao from '../../dao/node/hierarchy-node.dao';
import { HierarchyNodeRequestParam } from '../../domain/dto/haa-common.dto';
import { HierarchyNodeMap } from '../../domain/dtoEntityMap/hierarchy-node.map';
import CerptNodeEntity from '../../domain/entities/cerpt-node.entity';
import { HierarchyNodeQueryParams } from '../../domain/entities/haa-query-param.entity';
import Context from '../../utils/context';
import { IvsConnection } from '../../utils/database';
import HaaBasePatchService from '../haa-base-patch.service';
import HierarchyNodeValidatorService from '../validator/nodes/hierarchy-node-validation.service';

export default class HierarchyNodePatchService extends HaaBasePatchService<HierarchyNodeDao> {
  conn: IvsConnection;

  constructor(context: Context) {
    super({ context, dao: new HierarchyNodeDao({ context }) });
  }

  mapDtoToEntity(requestParam: HierarchyNodeRequestParam): CerptNodeEntity[] {
    return [HierarchyNodeMap.dtoToEntityForUpdate(requestParam)];
  }

  async mapToEntityQueryParams(requestParam: HierarchyNodeRequestParam): Promise<HierarchyNodeQueryParams> {
    const queryParam: HierarchyNodeQueryParams = <HierarchyNodeQueryParams>(
      this.mapToEntityQueryParamsCommon(requestParam)
    );
    queryParam.entities = this.mapDtoToEntity(requestParam);
    requestParam.nodeId && (queryParam.nodeId = requestParam.nodeId);
    return queryParam;
  }

  // mapToEntityQueryParamsCommon(requestParam: RequestParam): HierarchyNodeQueryParams {
  //   const queryParam = new HierarchyNodeQueryParams();
  //   queryParam.loginUser = requestParam.loginUser;
  //   return queryParam;
  // }

  async validateInput(queryParams: HierarchyNodeQueryParams) {
    const validationService: HierarchyNodeValidatorService = new HierarchyNodeValidatorService(this.dao);
    await validationService.validateInputForUpdate(queryParams);
  }
}
