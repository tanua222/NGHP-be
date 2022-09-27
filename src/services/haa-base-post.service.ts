import { BaseServiceOptions } from '../dao/base.dao';
import HaaBaseDao from '../dao/haa-base.dao';
import { HaaBaseDto, RequestParam } from '../domain/dto/haa-common.dto';
import PaginationResult from '../domain/dto/pagination-result.dto';
import ResponseDto from '../domain/dto/response.dto';
import BaseEntity from '../domain/entities/base.entity';
import HaaQueryParams from '../domain/entities/haa-query-param.entity';
import { StatusCode } from '../utils/constants';
import { IvsConnection } from '../utils/database';
import HaaBaseService from './haa-base.service';

export default class HaaBasePostService<T extends HaaBaseDao> extends HaaBaseService<T> {
  constructor(options: BaseServiceOptions) {
    super(options);
  }

  /**
   * Main function getting called from router and handling the flow of a GET order feature service
   * @param requestParams
   */
  async createHaaEntity(requestParams: RequestParam): Promise<ResponseDto<HaaBaseDto | null>> {
    this.conn = await IvsConnection.getConnection(this.dao.dbConfig, this.context);
    this.log.debug('HaaBasePostService.createHaaEntity connection retrieved: ', this.conn);
    try {
      const haaQueryParams: HaaQueryParams = await this.mapToEntityQueryParams(requestParams);
      this.log.debug(
        'HaaBasePostService.createHaaEntity mapToEntityQueryParamsForCreate is done with HaaQueryParams:',
        haaQueryParams
      );

      await this.validateInput(haaQueryParams);
      this.log.debug('HaaBasePostService.createHaaEntity validateInput is done');

      const entitiesResult: PaginationResult = await this.dao.createDbEntitiesByParams(haaQueryParams, this.conn);
      this.log.debug(
        `HaaBasePostService.createDbEntitiesByParams with query: addRecord is done with entitiesResult: ${entitiesResult}`
      );

      const resDto: HaaBaseDto =
        entitiesResult?.rows?.length > 0 ? this.mapEntityToDtoForCreate(entitiesResult.rows) : new HaaBaseDto();
      this.log.debug('HaaBasePostService.createHaaEntity mapEntityToDto is done with resDto:', resDto);

      const response: ResponseDto<HaaBaseDto> = this.prepareResponseForCreate(resDto, entitiesResult);
      this.log.debug('HaaBasePostService.createHaaEntity prepareResponse is done with response:', response);

      await this.conn.commit();
      this.log.debug(`createLdOrder data committed`);
      return response;
    } catch (error) {
      this.log.error('HaaBasePostService.createHaaEntity error occured:', error);
      await this.conn.rollback();
      return ResponseDto.catchResponse(this.context, error);
    } finally {
      if (this.conn) {
        try {
          this.conn.close();
          this.log.debug('HaaBasePostService.createHaaEntity connection closed');
          this.conn = undefined;
        } catch (err) {
          this.log.error('HaaBasePostService.createHaaEntity finally with error!', err);
        }
      }
    }
  }

  prepareResponseForCreate(resDto: HaaBaseDto, entitiesResult: PaginationResult): ResponseDto<HaaBaseDto> {
    let response: ResponseDto<HaaBaseDto> = this.prepareCommonResponse(resDto, entitiesResult);
    response.reponseCode(StatusCode.CREATED);
    return response;
  }

  mapEntityToDtoForCreate(rows: any[]): HaaBaseDto {
    throw new Error('Method not implemented.');
  }

  async mapToEntityQueryParams(requestParam: RequestParam): Promise<HaaQueryParams> {
    let HaaQueryParams = this.mapToEntityQueryParamsCommon(requestParam);
    requestParam.inputRequest && (HaaQueryParams.entities = this.mapDtoToEntity(requestParam));
    return HaaQueryParams;
  }

  mapDtoToEntity(requestParam: RequestParam): BaseEntity[] {
    // TODO: mapDtoToEntityForUpdate
    return super.mapDtoToEntity(requestParam);
  }

  validateInput(haaQueryParams: HaaQueryParams) {
    // TODO: validateInputForCreate
    super.validateInput(haaQueryParams);
  }
}
