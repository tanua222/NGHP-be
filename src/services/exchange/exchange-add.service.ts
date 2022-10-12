import ExchangeAddDao from '../../dao/exchange/exchange-add.dao';
import ExchangeGetDto from '../../domain/dto/exchange/exchange-get.dto';
import { HaaBaseDto, RequestParam } from '../../domain/dto/haa-common.dto';
import ResponseDto, { Error } from '../../domain/dto/response.dto';
import { ExchangeAddMap } from '../../domain/dtoEntityMap/exchange/exchange-add.map';
import ExchangeAddEntity from '../../domain/entities/exchange/exchange-add.entity';
import { ExchangeAddQueryParam } from '../../domain/entities/haa-query-param.entity';
import { errorResponse } from '../../error/error-responses';
import { ErrorMapping } from '../../error/error-responses-mapping';
import { StatusCode } from '../../utils/constants';
import Context from '../../utils/context';
import { IvsConnection } from '../../utils/database';
import HaaBaseService from '../haa-base.service';

export default class ExchangeAddService extends HaaBaseService<ExchangeAddDao> {
  constructor(context: Context) {
    super({ context, dao: new ExchangeAddDao({ context }) });
  }

  async mapToEntityQueryParams(requestParam: RequestParam): Promise<ExchangeAddQueryParam> {
    const queryParam: ExchangeAddQueryParam = <ExchangeAddQueryParam>(
      this.mapToEntityQueryParamsCommon(requestParam)
    );
    const entity: ExchangeAddEntity = ExchangeAddMap.dtoToEntityForCreate(requestParam);

    for await (const npaItem of entity.npa) {
      npaItem.id = await this.dao.getNpaExchId();
    }

    Object.assign(queryParam, entity);

    return queryParam;
  }

  async executeAddExchangeDaoTask(params: any) {
    return await this.dao.addExchange(params, this.conn);
  }

  async executeCountNpaDaoTask(params: any) {
    return await this.dao.countNpa(params, this.conn);
  }


  async executeAddNpaExchangesDaoTask(params: any) {
    params.rowsAffected = 0;
    for await (const npaItem of params.npa) {
      const insertResult = await this.dao.addNpaExchange(npaItem, this.conn);
      params.rowsAffected += insertResult?.rowsAffected || 0;
    }
    return params;
  }

  getResponse(params: ExchangeAddQueryParam): ResponseDto<HaaBaseDto> {
    let response: ResponseDto<HaaBaseDto> = this.mapQueryParamsToDto(params);
    response.reponseCode(StatusCode.CREATED);
    return response;
  }
  mapQueryParamsToDto(params: any): ResponseDto<ExchangeGetDto> {
    let response = new ResponseDto<ExchangeGetDto>();
    if (params) {
      response.result = {
        abbreviation: params.abbreviation,
        bookNumber: params.bookNumber,
        createdUserId: params.createdUserId,
        fullName: params.fullName,
        lastUpdatedUserId: params.lastUpdatedUserId,
        npa: params.npa,
        secondAbbreviation: params.secondAbbreviation,
        sectionNumber: params.sectionNumber
      };
    }


    return response;
  }

  async validateInput(params: any): Promise<void> {
    const errors: Error[] = [];
    const npa = params.inputRequest?.npa;

    if (!npa || npa.length === 0) {
      errors.push(errorResponse(ErrorMapping.IVSHAA4404, this.context, { npa: [] }));
      return ResponseDto.returnValidationErrors(errors);
    }
    const npaSet = new Set();

    for (const item of npa) {
      const npa = item.npa;
      if (!npa) {
        errors.push(errorResponse(ErrorMapping.IVSHAA4404, this.context, { item }));
      }
      npaSet.add(item.npa);
    }

    if (npa.length !== npaSet.size) {
      errors.push(errorResponse(ErrorMapping.IVSHAA4420, this.context, { npa, npas: Array.from(npaSet) }));
    }

    if (errors.length > 0) {
      return ResponseDto.returnValidationErrors(errors);
    }

    params.npaList = Array.from(npaSet).join();
    const existedNpa = await this.executeCountNpaDaoTask(params);

    if (npa.length !== existedNpa[0]) {
      errors.push(errorResponse(ErrorMapping.IVSHAA4404, this.context, { npa: [] }));
      return ResponseDto.returnValidationErrors(errors);
    }
  }

  async executeTask(args: any): Promise<ResponseDto<any>> {
    this.conn = await IvsConnection.getConnection(this.dao.dbConfig, this.context);
    this.log.debug('ExchangeAddService.executeTask connection retrieved: ', this.conn);
    try {
      let params = args.params;

      // must be before 'mapToEntityQueryParams' to avoid redundant ids generation by Oracle DB
      await this.validateInput(params);

      params = await this.mapToEntityQueryParams(params);

      this.log.debug(`params`, params);

      let result = await this.executeAddExchangeDaoTask(params);

      if (result) {
        result.expectedRowsAffected = 1;
        this.validateResult(result);

        result = await this.executeAddNpaExchangesDaoTask(params);

        if (result) {
          result.expectedRowsAffected = params?.npa.length || 0;
          this.validateResult(result);
        }
        await this.conn.commit();
        this.log.debug(`data committed`);
      }

      return this.getResponse(params);
    } catch (error) {
      this.log.error('ExchangeAddService.executeTask error occured:', error);
      await this.conn.rollback();

      if ((<any>error).errorNum === 20109) {
        throw ResponseDto.internalErrorCode(this.context, ErrorMapping.IVSHAA4415);
      }
      if ((<any>error).errorNum === 20110) {
        throw ResponseDto.internalErrorCode(this.context, ErrorMapping.IVSHAA4416);
      }

      throw error;
    } finally {
      if (this.conn) {
        try {
          this.conn.close();
          this.log.debug('ExchangeAddService.executeTask connection closed');
          this.conn = undefined;
        } catch (err) {
          this.log.error('ExchangeAddService.executeTask finally with error!', err);
        }
      }
    }
  }

  validateResult({ rowsAffected, expectedRowsAffected }: any) {
    if (rowsAffected < expectedRowsAffected) {
      throw ResponseDto.internalErrorCode(this.context, ErrorMapping.IVSHAA4417);
    }
  }


}
