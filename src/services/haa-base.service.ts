import { BaseServiceOptions } from '../dao/base.dao';
import HaaBaseDao from '../dao/haa-base.dao';
import { HaaBaseDto, RequestParam } from '../domain/dto/haa-common.dto';
import PaginationResult from '../domain/dto/pagination-result.dto';
import ResponseDto from '../domain/dto/response.dto';
import BaseEntity from '../domain/entities/base.entity';
import HaaQueryParams from '../domain/entities/haa-query-param.entity';
import { ErrorMapping } from '../error/error-responses-mapping';
import { IvsConnection } from '../utils/database';
import BaseService from './base.service';

export default class HaaBaseService<T extends HaaBaseDao> extends BaseService<T> {
  conn: IvsConnection | undefined;

  constructor(options: BaseServiceOptions) {
    super(options);
  }

  /**
   * This function is for validation of input
   * In case common valdiations required it can be implmented here
   * Implement this service for additional validations
   * @param requestParams
   */
  validateInput(haaQueryParams: HaaQueryParams) {
    // TODO add validation for order id and other possible params e.g. hierarchy node id etc
  }

  /**
   * Main function getting called from router and handling the flow of a GET service
   * @param requestParams
   */
  async retrieveHaaEntity(requestParams: RequestParam): Promise<ResponseDto<HaaBaseDto | null>> {
    throw new Error('Method not implemented: retrieveHaaEntity()');
  }

  /**
   * Main function getting called from router and handling the flow of a POST service
   * @param requestParams
   */
  async createHaaEntity(requestParams: RequestParam): Promise<ResponseDto<HaaBaseDto | null>> {
    throw new Error('Method not implemented: createHaaEntity()');
  }

  /**
   * Main function getting called from router and handling the flow of a PATCH service
   * @param requestParams
   */
  async updateHaaEntity(requestParams: RequestParam): Promise<ResponseDto<HaaBaseDto | null>> {
    throw new Error('Method not implemented: updateHaaEntity()');
  }

  /**
   * Main function getting called from router and handling the flow of a DELETE service
   * @param requestParams
   */
  async deleteHaaEntity(requestParams: RequestParam): Promise<ResponseDto<HaaBaseDto | null>> {
    throw new Error('Method not implemented: deleteHaaEntity()');
  }

  mapToEntityQueryParamsCommon(requestParam: RequestParam): HaaQueryParams {
    let haaQueryParams = new HaaQueryParams();
    requestParam?.corporationId && (haaQueryParams.corporationId = requestParam.corporationId);
    requestParam?.loginUser && (haaQueryParams.loginUser = requestParam.loginUser);
    requestParam?.hierarchyNodeId && (haaQueryParams.hnId = requestParam.hierarchyNodeId);
    requestParam?.parentHierarchyNodeId && (haaQueryParams.parentHnId = requestParam.parentHierarchyNodeId);
    requestParam?.userId && (haaQueryParams.userId = requestParam.userId);
    requestParam?.entityId && (haaQueryParams.entityId = requestParam.entityId);
    return haaQueryParams;
  }

  isPaginationRequired(requestParam?: RequestParam): boolean {
    return false;
  }

  prepareCommonResponse(resDto: HaaBaseDto, entitiesResult: PaginationResult): ResponseDto<HaaBaseDto> {
    let response = new ResponseDto<HaaBaseDto>();
    resDto && (response.result = resDto);
    response.totalCount = entitiesResult.numberOfRows;
    response.pageCount = entitiesResult.numberOfPages;
    response.resultCount = entitiesResult.limit;
    return response;
  }

  mapDtoToEntity(requestParam: RequestParam): BaseEntity[] {
    throw ResponseDto.internalErrorCode(this.context, ErrorMapping.IVSHAA4401);
  }

  async mapToEntityQueryParams(requestParam: RequestParam): Promise<HaaQueryParams> {
    let haaEntityQueryParams = this.mapToEntityQueryParamsCommon(requestParam);
    haaEntityQueryParams.entities = this.mapDtoToEntity(requestParam);
    return haaEntityQueryParams;
  }

  /**
   * Whether to query and add session user's id to parameters or not.
   */
  addLoginUserIdParam() {
    return false;
  }
}
