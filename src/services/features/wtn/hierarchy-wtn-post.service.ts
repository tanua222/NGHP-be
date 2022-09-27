import HierarchyWtnDao from '../../../dao/features/wtn/hierarchy-wtn.dao';
import { HierarchyNodeRequestParam, RequestParam } from '../../../domain/dto/haa-common.dto';
import HierarchyWtnDto from '../../../domain/dto/hierarchy-wtn.dto';
import { HierarchyWtnMap } from '../../../domain/dtoEntityMap/hierarchy-wtn.map';
import HaaQueryParams, { HierarchyNodeQueryParams } from '../../../domain/entities/haa-query-param.entity';
import HierarchyWtnEntity from '../../../domain/entities/hierarchy-wtn.entity';
import Context from '../../../utils/context';
import { IvsConnection } from '../../../utils/database';
import HaaBasePostService from '../../haa-base-post.service';
import HierarchyWtnValidatorService from '../../validator/features/wtn/hierarchy-wtn-validation.service';

export default class HierarchyWtnPostService extends HaaBasePostService<HierarchyWtnDao> {
  conn: IvsConnection;

  constructor(context: Context) {
    super({ context, dao: new HierarchyWtnDao({ context }) });
  }

  mapEntityToDto(ivsEntity: HierarchyWtnEntity[]): HierarchyWtnDto[] {
    return HierarchyWtnMap.entityToDtoMapping(ivsEntity);
  }

  mapDtoToEntity(requestParam: HierarchyNodeRequestParam): HierarchyWtnEntity[] {
    return [HierarchyWtnMap.dtoToEntityForCreate(requestParam)];
  }

  mapEntityToDtoForCreate(rows: any[]): HierarchyWtnDto {
    return new HierarchyWtnDto();
  }

  async mapToEntityQueryParams(requestParam: RequestParam): Promise<HierarchyNodeQueryParams> {
    const queryParam: HierarchyNodeQueryParams = <HierarchyNodeQueryParams>(
      this.mapToEntityQueryParamsCommon(requestParam)
    );
    queryParam.entities = this.mapDtoToEntity(requestParam);
    queryParam.nodeType = 'WTN';
    queryParam.parentHierarchyNodeId = requestParam.inputRequest.parentHierarchyNodeId;
    return queryParam;
  }
  async validateInput(queryParams: HierarchyNodeQueryParams): Promise<void> {
    const validationService: HierarchyWtnValidatorService = new HierarchyWtnValidatorService(this.dao);
    await validationService.validateInputForCreate(queryParams);
  }
}
