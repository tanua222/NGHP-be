import ExchangeGetDao from '../../dao/exchange/exchange-get.dao';
import { RequestParam, SortParam } from '../../domain/dto/haa-common.dto';
import { ExchangeMap } from '../../domain/dtoEntityMap/exchange/exchange-get.map';
import HaaQueryParams, { ExchangeGetQueryParam } from '../../domain/entities/haa-query-param.entity';
import ExchangeGetEntity from '../../domain/entities/exchange/exchange-get.entity';
import Context from '../../utils/context';
import HaaBaseGetService from '../haa-base-get.service';
import { ExchangeRequestParam } from '../../domain/dto/haa-common.dto';


export default class ExchangeGetService extends HaaBaseGetService<ExchangeGetDao> {
  constructor(context: Context) {
    super({ context, dao: new ExchangeGetDao({ context: context }) });
  }

  isPaginationRequired(requestParam?: RequestParam): boolean {
    return true;
  }

  isArray(): boolean {
    return true;
  }

  getQueryNameForRetrieve(entityQueryParams: HaaQueryParams): string {
    return 'getAllExchange';
  }

  mapEntityToDto(entity: ExchangeGetEntity[]) {
    return ExchangeMap.entityToDto(entity);
  }

  getDtoToEntitySortParams(sortParams: SortParam[]): SortParam[] {
    return ExchangeMap.mapDtoToEntitySortParams(sortParams);
  }

  mapToEntityQueryParams(requestParam: ExchangeRequestParam): HaaQueryParams {
    const haaEntityQueryParams: ExchangeGetQueryParam = super.mapToEntityQueryParams(requestParam);

    haaEntityQueryParams.filter = requestParam.filter;

    return haaEntityQueryParams;
  }

}
