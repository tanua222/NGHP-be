import ExchangeDao from '../../dao/exchange.dao';
import { RequestParam, SortParam } from '../../domain/dto/haa-common.dto';
import { ExchangeMap } from '../../domain/dtoEntityMap/exchange.map';
import HaaQueryParams, { ExchangeQueryParam } from '../../domain/entities/haa-query-param.entity';
import ExchangeEntity from '../../domain/entities/exchange.entity';
import Context from '../../utils/context';
import HaaBaseGetService from '../haa-base-get.service';
import { ExchangeRequestParam } from '../../domain/dto/haa-common.dto';


export default class ExchangeGetService extends HaaBaseGetService<ExchangeDao> {
  constructor(context: Context) {
    super({ context, dao: new ExchangeDao({ context: context }) });
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

  // fixme
  mapEntityToDto(entity: ExchangeEntity[]) {
    return ExchangeMap.entityToDto(entity);
  }

  // fixme
  getDtoToEntitySortParams(sortParams: SortParam[]): SortParam[] {
    return ExchangeMap.mapDtoToEntitySortParams(sortParams);
  }

  mapToEntityQueryParams(requestParam: ExchangeRequestParam): HaaQueryParams {
    const haaEntityQueryParams: ExchangeQueryParam = super.mapToEntityQueryParams(requestParam);

    haaEntityQueryParams.filter = requestParam.filter;

    return haaEntityQueryParams;
  }

}
