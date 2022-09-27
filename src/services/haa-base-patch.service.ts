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

export default class HaaBasePatchService<T extends HaaBaseDao> extends HaaBaseService<T> {
  constructor(options: BaseServiceOptions) {
    super(options);
  }

  async updateHaaEntity(requestParams: RequestParam): Promise<ResponseDto<HaaBaseDto | null>> {
    this.conn = await IvsConnection.getConnection(this.dao.dbConfig, this.context);
    this.log.debug('HaaBasePatchService.updateHaaEntity connection retrieved: ', this.conn);

    try {
      const haaQueryParams: HaaQueryParams = await this.mapToEntityQueryParams(requestParams);
      this.log.debug(
        'HaaBasePatchService.updateHaaEntity mapToEntityQueryParamsForUpdate is done with haaQueryParams:',
        haaQueryParams
      );

      await this.validateInput(haaQueryParams);
      this.log.debug('HaaBasePatchService.updateHaaEntity validateInput is done');

      const entitiesResult: PaginationResult = await this.dao.updateDbEntitiesByParams(haaQueryParams, this.conn);
      this.log.debug(
        `HaaBasePatchService.updateHaaEntity updateHaaData with query: addRecord is done with entitiesResult: ${entitiesResult}`
      );

      const resDto: HaaBaseDto = new HaaBaseDto();
      this.log.debug('HaaBasePatchService.updateHaaEntity update is done without restDto:', resDto);

      const response: ResponseDto<HaaBaseDto> = this.prepareResponseForUpdate(resDto, entitiesResult);
      this.log.debug('HaaBasePatchService.updateHaaEntity prepareResponseForUpdate is done with response:', response);

      await this.conn.commit();
      this.log.debug(`HaaBasePatchService updateHaaEntity data committed`);
      return response;
    } catch (error) {
      this.log.error('HaaBasePatchService.updateHaaEntity error occured:', error);
      await this.conn.rollback();
      return ResponseDto.catchResponse(this.context, error);
    } finally {
      if (this.conn) {
        try {
          this.conn.close();
          this.log.debug('HaaBasePatchService.updateHaaEntity connection closed');
          this.conn = undefined;
        } catch (err) {
          this.log.error('HaaBasePatchService.updateHaaEntity finally with error!', err);
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
    // TODO: mapDtoToEntityForUpdate
    return super.mapDtoToEntity(requestParam);
  }

  validateInput(haaQueryParams: HaaQueryParams) {
    // TODO: validateInputForDelete
    super.validateInput(haaQueryParams);
  }

  prepareResponseForUpdate(resDto: HaaBaseDto, entitiesResult: PaginationResult): ResponseDto<HaaBaseDto> {
    let response: ResponseDto<HaaBaseDto> = this.prepareCommonResponse(resDto, entitiesResult);
    response.reponseCode(StatusCode.NO_CONTENT);
    return response;
  }
}
