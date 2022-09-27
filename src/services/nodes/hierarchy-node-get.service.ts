import HierarchyNodeDao from '../../dao/node/hierarchy-node.dao';
import { HierarchyNodeRequestParam } from '../../domain/dto/haa-common.dto';
import HierarchyNodeDto from '../../domain/dto/hierarchy-node.dto';
import { HierarchyNodeMap } from '../../domain/dtoEntityMap/hierarchy-node.map';
import haaQueryParamEntity, { HierarchyNodeQueryParams } from '../../domain/entities/haa-query-param.entity';
import CerptNodeEntity from '../../domain/entities/cerpt-node.entity';
import Context from '../../utils/context';
import HaaBaseGetService from '../haa-base-get.service';
import { IvsConnection } from '../../utils/database';
import HierarchyNodeValidatorService from '../validator/nodes/hierarchy-node-validation.service';

export default class HierarchyNodeGetService extends HaaBaseGetService<HierarchyNodeDao> {
  conn: IvsConnection;

  constructor(context: Context) {
    super({ context, dao: new HierarchyNodeDao({ context }) });
  }

  mapEntityToDto(ivsEntity: CerptNodeEntity[]): HierarchyNodeDto[] {
    return HierarchyNodeMap.entityToDtoMapping(ivsEntity);
  }

  mapToEntityQueryParams(requestParam: HierarchyNodeRequestParam): any {
    let haaEntityQueryParams: HierarchyNodeQueryParams = super.mapToEntityQueryParams(requestParam);
    requestParam.nodeId && (haaEntityQueryParams.nodeId = requestParam.nodeId);
    return haaEntityQueryParams;
  }

  async findHierarchyNodeByParams(args: any) {
    return this.dao.findHierarchyNodeByParams(args);
  }

  async findNodeByParams(args: any) {
    return this.dao.findNodeByParams(args);
  }

  async validateInput(queryParams: HierarchyNodeQueryParams): Promise<void> {
    const validationService: HierarchyNodeValidatorService = new HierarchyNodeValidatorService(this.dao);
    await validationService.validateInputForGet(queryParams);
  }
}
