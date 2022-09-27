import HomePageStatisticsDao from '../dao/home-page-statistics.dao';
import { RequestParam, SortParam } from '../domain/dto/haa-common.dto';
import { HomePageStatisticsMap } from '../domain/dtoEntityMap/home-page-statistics.map';
import HaaQueryParams from '../domain/entities/haa-query-param.entity';
import HomePageStatisticsEntity from '../domain/entities/home-page-statistics.entity';
import Context from '../utils/context';
import HaaBaseGetService from './haa-base-get.service';

export default class FileStatisticsService extends HaaBaseGetService<HomePageStatisticsDao> {
  constructor(context: Context) {
    super({ context, dao: new HomePageStatisticsDao({ context: context }) });
  }

  isPaginationRequired(requestParam?: RequestParam): boolean {
    return true;
  }

  getQueryNameForRetrieve(entityQueryParams: HaaQueryParams): string {
    return 'homePageStatistics';
  }

  mapEntityToDto(entity: HomePageStatisticsEntity[]) {
    return HomePageStatisticsMap.entityToDto(entity);
  }

  getDtoToEntitySortParams(sortParams: SortParam[]): SortParam[] {
    return HomePageStatisticsMap.mapDtoToEntitySortParams(sortParams);
  }


  // version 2

  // async getHomePageStatistics(): Promise<any> {
  //   try {
  //     const result = await this.dao.statistics();
  //     return {
  //       status: "success",
  //       data: result
  //     };
  //   } catch (error) {
  //     this.log.error(error);
  //     return ResponseDto.internalError();
  //   }
  // }
}
