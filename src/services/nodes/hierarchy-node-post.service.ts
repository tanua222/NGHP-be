import HierarchyNodeDao from '../../dao/node/hierarchy-node.dao';
import { RequestParam } from '../../domain/dto/haa-common.dto';
import HierarchyNodeDto from '../../domain/dto/hierarchy-node.dto';
import { HierarchyNodeMap } from '../../domain/dtoEntityMap/hierarchy-node.map';
import haaQueryParamEntity, { HierarchyNodeQueryParams } from '../../domain/entities/haa-query-param.entity';
import CerptNodeEntity from '../../domain/entities/cerpt-node.entity';
import Context from '../../utils/context';
import HaaBasePostService from '../haa-base-post.service';
import HierarchyNodeValidatorService from '../validator/nodes/hierarchy-node-validation.service';
export default class HierarchyNodePostService extends HaaBasePostService<HierarchyNodeDao> {
  constructor(context: Context) {
    super({ context, dao: new HierarchyNodeDao({ context }) });
  }

  mapEntityToDto(ivsEntity: CerptNodeEntity[]): HierarchyNodeDto[] {
    return HierarchyNodeMap.entityToDtoMapping(ivsEntity);
  }

  mapDtoToEntity(requestParam: RequestParam): CerptNodeEntity[] {
    return [HierarchyNodeMap.dtoToEntityForCreate(requestParam)];
  }

  async mapToEntityQueryParams(requestParam: RequestParam): Promise<HierarchyNodeQueryParams> {
    const queryParam: HierarchyNodeQueryParams = <HierarchyNodeQueryParams>(
      this.mapToEntityQueryParamsCommon(requestParam)
    );
    queryParam.entities = this.mapDtoToEntity(requestParam);
    queryParam.nodeType = 'NODE';
    queryParam.parentHierarchyNodeId = requestParam.inputRequest.parentHierarchyNodeId;
    return queryParam;
  }

  // //temporary, need to delete when post framework is complete
  // mapToEntityQueryParamsCommon(requestParam: RequestParam): HierarchyNodeQueryParams {
  //   const queryParam = new HierarchyNodeQueryParams();
  //   queryParam.loginUser = requestParam.loginUser;
  //   return queryParam;
  // }

  mapEntityToDtoForCreate(rows: any[]): HierarchyNodeDto {
    return new HierarchyNodeDto();
  }

  async validateInput(queryParams: HierarchyNodeQueryParams): Promise<void> {
    const validationService: HierarchyNodeValidatorService = new HierarchyNodeValidatorService(this.dao);
    await validationService.validateInputForCreate(queryParams);
  }
}
