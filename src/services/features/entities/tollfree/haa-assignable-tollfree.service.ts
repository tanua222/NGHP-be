import HaaAssignableTollfreeDao from '../../../../dao/features/entities/haa-assiginable-tollfree.dao';
import { AssignableTollfreeRequestParam, RequestParam, SortParam } from '../../../../domain/dto/haa-common.dto';
import { HaaAssignableTollfreeMap } from '../../../../domain/dtoEntityMap/haa-assignable-tollfree.map';
import HaaAssignableTollfreeEntity from '../../../../domain/entities/haa-assignable-tollfree.entity';
import HaaQueryParams, { HaaAssignableTollfreeQueryParam } from '../../../../domain/entities/haa-query-param.entity';
import Context from '../../../../utils/context';
import HaaBaseGetService from '../../../haa-base-get.service';
import HaaTollfreeValidatorService from '../../../validator/features/entities/haa-tollfree-validation.service';

export default class HaaAssignableTollfreeService extends HaaBaseGetService<HaaAssignableTollfreeDao> {
  constructor(context: Context) {
    super({ context, dao: new HaaAssignableTollfreeDao({ context }) });
  }

  isPaginationRequired(_requestParam?: RequestParam): boolean {
    return true;
  }

  isArray(): boolean {
    return true;
  }

  getDtoToEntitySortParams(sortParams: SortParam[]): SortParam[] {
    return HaaAssignableTollfreeMap.mapDtoToEntitySortParams(sortParams);
  }

  mapEntityToDto(ivsEntity: HaaAssignableTollfreeEntity[]) {
    return HaaAssignableTollfreeMap.entityToDto(ivsEntity);
  }

  mapToEntityQueryParams(requestParam: AssignableTollfreeRequestParam): HaaAssignableTollfreeQueryParam {
    const tfEntityQueryParams: HaaAssignableTollfreeQueryParam = super.mapToEntityQueryParams(requestParam);
    requestParam.tollfreeNumber && (tfEntityQueryParams.tollfreeNumber = requestParam.tollfreeNumber);
    return tfEntityQueryParams;
  }

  async validateInput(queryParams: HaaQueryParams) {
    const validationService = new HaaTollfreeValidatorService(this.dao);
    validationService.validateInputForGetAssignable(queryParams);
  }
}
