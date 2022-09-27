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

export default class HaaBaseDeleteService<T extends HaaBaseDao> extends HaaBaseService<T> {
  constructor(options: BaseServiceOptions) {
    super(options);
  }

  async deleteHaaEntity(requestParams: RequestParam): Promise<ResponseDto<HaaBaseDto | null>> {
    this.conn = await IvsConnection.getConnection(this.dao.dbConfig, this.context);
    this.log.debug('HaaBaseDeleteService.deleteHaaEntity connection retrieved: ', this.conn);
    try {
      const haaEntityQueryParams = await this.mapToEntityQueryParams(requestParams);
      this.log.debug(
        'HaaBaseDeleteService.deleteHaaEntity mapToEntityQueryParamsForDelete is done with haaEntityQueryParams:',
        haaEntityQueryParams
      );

      await this.validateInput(haaEntityQueryParams);
      this.log.debug('HaaBaseDeleteService.deleteHaaEntity validateInputForDelete is done');

      const entitiesResult: PaginationResult = await this.dao.deleteDbEntitiesByParams(haaEntityQueryParams, this.conn);
      this.log.debug(
        `HaaBaseDeleteService.deleteHaaEntity deleteHaaOrderData with query: addRecord is done with entitiesResult: ${entitiesResult}`
      );

      const resDto: HaaBaseDto = new HaaBaseDto();
      this.log.debug('HaaBaseDeleteService.deleteHaaEntity mapEntityToDto is done with resDto:', resDto);

      const response: ResponseDto<HaaBaseDto> = this.prepareResponseForDelete(resDto, entitiesResult);
      this.log.debug('HaaBaseDeleteService.deleteHaaEntity prepareResponse is done with response:', response);

      await this.conn.commit();
      this.log.debug(`HaaBaseDeleteService deleteHaaEntity data committed`);
      return response;
    } catch (error) {
      this.log.error('HaaBaseDeleteService.deleteHaaEntity error occured:', error);
      await this.conn.rollback();
      return ResponseDto.catchResponse(this.context, error);
    } finally {
      if (this.conn) {
        try {
          this.conn.close();
          this.log.debug('HaaBaseDeleteService.deleteHaaEntity connection closed');
          this.conn = undefined;
        } catch (err) {
          this.log.error('HaaBaseDeleteService.deleteHaaEntity finally with error!', err);
          return ResponseDto.catchResponse(this.context, err);
        }
      }
    }
  }

  async mapToEntityQueryParams(requestParam: RequestParam): Promise<HaaQueryParams> {
    // TODO: mapToEntityQueryParamsForDelete
    return await super.mapToEntityQueryParams(requestParam);
  }

  mapDtoToEntity(requestParam: RequestParam): BaseEntity[] {
    // TODO: mapDtoToEntityForDelete
    return super.mapDtoToEntity(requestParam);
  }

  validateInput(haaQueryParams: HaaQueryParams) {
    // TODO: validateInputForDelete
    super.validateInput(haaQueryParams);
  }

  prepareResponseForDelete(resDto: HaaBaseDto, entitiesResult: PaginationResult): ResponseDto<HaaBaseDto> {
    let response: ResponseDto<HaaBaseDto> = this.prepareCommonResponse(resDto, entitiesResult);
    response.reponseCode(StatusCode.NO_CONTENT);
    return response;
  }
}
