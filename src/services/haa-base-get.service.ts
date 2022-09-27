import { BaseArgs, BaseServiceOptions } from '../dao/base.dao';
import CerptUsersDao from '../dao/cerpt-users.dao';
import HaaBaseDao from '../dao/haa-base.dao';
import { HaaBaseDto, PaginationParam, RequestParam, SortParam } from '../domain/dto/haa-common.dto';
import PaginationResult from '../domain/dto/pagination-result.dto';
import ResponseDto from '../domain/dto/response.dto';
import HaaQueryParams from '../domain/entities/haa-query-param.entity';
import { ErrorMapping } from '../error/error-responses-mapping';
import { Language, StatusCode } from '../utils/constants';
import HaaBaseService from './haa-base.service';

export default class HaaBaseGetService<T extends HaaBaseDao> extends HaaBaseService<T> {
  constructor(options: BaseServiceOptions) {
    super(options);
  }

  /**
   * Main function getting called from router and handling the flow of a GET order feature service
   * @param requestParams
   * @param res
   */
  async retrieveHaaEntity(requestParams: RequestParam): Promise<ResponseDto<HaaBaseDto | null>> {
    try {
      const params: HaaQueryParams = this.mapToEntityQueryParams(requestParams);
      this.log.debug(
        `HaaBaseGetService.retrieveHaaEntity mapToEntityQueryParams is done with entityQueryParams:`,
        params
      );

      await this.validateInput(params);
      this.log.debug('HaaBaseGetService.retrieveHaaEntity validateInput is done');

      const query = this.getQueryNameForRetrieve(params);
      const entities: PaginationResult = await this.paginate({ params, query });
      this.log.debug(
        `HaaBaseGetService.retrieveHaaEntity getTfOrderEntityData with query:${query} is done with raw entities count: ${entities.rows.length}`
      );

      const dtos = this.mapEntityToDto(entities.rows);
      this.log.debug(`HaaBaseGetService.retrieveHaaEntity mapEntityToDto is done with dto count: ${dtos.length}`);

      const response: ResponseDto<HaaBaseDto> = this.prepareResponseForRetrieve(dtos, entities);
      this.log.debug('HaaBaseGetService.retrieveHaaEntity prepareResponse is done');

      return response;
    } catch (error) {
      this.log.error('HaaBaseGetService.retrieveHaaEntity error occured:', error);
      if (error instanceof ResponseDto) {
        throw error;
      }
      throw ResponseDto.internalErrorCode(this.context, ErrorMapping.IVSHAA4402, error);
    }
  }

  async paginate(args: BaseArgs) {
    return await this.dao.paginateByFilters(args);
  }

  mapToEntityQueryParams(requestParam: RequestParam): any {
    let haaEntityQueryParams = this.mapToEntityQueryParamsCommon(requestParam);
    haaEntityQueryParams.sortParams = haaEntityQueryParams?.paginationParam?.paginationRequired
      ? this.getDtoToEntitySortParams(requestParam?.sortParams || [])
      : undefined;
    return haaEntityQueryParams;
  }

  mapToEntityQueryParamsCommon(requestParam: RequestParam): HaaQueryParams {
    const haaEntityQueryParams = super.mapToEntityQueryParamsCommon(requestParam);

    haaEntityQueryParams.paginationParam = new PaginationParam();
    !requestParam?.paginationParam?.ignoreServicePagination &&
      (haaEntityQueryParams.paginationParam.paginationRequired = this.isPaginationRequired(requestParam));
    haaEntityQueryParams.paginationParam.limit = requestParam?.paginationParam?.limit;
    haaEntityQueryParams.paginationParam.offset = requestParam?.paginationParam?.offset;

    if (requestParam.languageHeader?.startsWith('fr')) haaEntityQueryParams.lan = Language.FR;
    else haaEntityQueryParams.lan = Language.EN;

    return haaEntityQueryParams;
  }

  getDtoToEntitySortParams(sortParams: SortParam[]): SortParam[] {
    throw new Error('Method not implemented.');
  }

  isArray(): boolean {
    return false;
  }

  getQueryNameForRetrieve(entityQueryParams: HaaQueryParams): string {
    return entityQueryParams?.paginationParam?.paginationRequired ? 'findByFiltersWithPagination' : 'findByFilters';
  }

  prepareCommonResponse(resDto: HaaBaseDto[], entitiesResult: PaginationResult): ResponseDto<HaaBaseDto> {
    let response = new ResponseDto<HaaBaseDto>();
    if (resDto) {
      if (this.isArray()) {
        // array
        response.result = resDto;
      } else if (resDto.length) {
        // single object
        response.result = resDto[0];
      }
    }
    response.totalCount = entitiesResult.numberOfRows;
    response.pageCount = entitiesResult.numberOfPages;
    response.resultCount = entitiesResult.limit;
    return response;
  }

  prepareResponseForRetrieve(resDto: HaaBaseDto[], entitiesResult: PaginationResult): ResponseDto<HaaBaseDto> {
    let response: ResponseDto<HaaBaseDto> = this.prepareCommonResponse(resDto, entitiesResult);
    const returnStatusCode = !resDto
      ? StatusCode.ERR_NOT_FOUND
      : entitiesResult.paginationRequired
      ? StatusCode.PAGINATION_SUCCESS
      : StatusCode.SUCCESS;
    response.reponseCode(returnStatusCode);
    return response;
  }
}
