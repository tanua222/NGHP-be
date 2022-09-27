import HaaExtractsListDao from '../../../dao/features/extracts/haa-extracts-list.dao';
import { RequestParam, SortParam } from '../../../domain/dto/haa-common.dto';
import { HaaExtractListMap } from '../../../domain/dtoEntityMap/haa-extract-list.map';
import HaaExtractEntity from '../../../domain/entities/haa-extract.entity';
import Context from '../../../utils/context';
import HaaBaseGetService from '../../haa-base-get.service';

export default class HaaExtractListService extends HaaBaseGetService<HaaExtractsListDao> {
  constructor(context: Context) {
    super({ context, dao: new HaaExtractsListDao({ context }) });
  }

  isPaginationRequired(requestParam?: RequestParam): boolean {
    return true;
  }

  isArray(): boolean {
    return true;
  }

  getDtoToEntitySortParams(sortParams: SortParam[]): SortParam[] {
    return HaaExtractListMap.mapDtoToEntitySortParams(sortParams);
  }

  mapEntityToDto(ivsEntity: HaaExtractEntity[]) {
    return HaaExtractListMap.entityToDto(ivsEntity);
  }

  addLoginUserIdParam() {
    return true;
  }
}
