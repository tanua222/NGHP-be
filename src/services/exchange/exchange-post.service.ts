import ExchangePostDao from '../../dao/exchange-post.dao';
import ExchangeGetDto from '../../domain/dto/exchange-get.dto';
import { HaaBaseDto, RequestParam } from '../../domain/dto/haa-common.dto';
import ResponseDto, { Error } from '../../domain/dto/response.dto';
import { ExchangePostMap } from '../../domain/dtoEntityMap/exchange-post.map';
import ExchangePostEntity from '../../domain/entities/exchange-post.entity';
import { ExchangeAddQueryParam } from '../../domain/entities/haa-query-param.entity';
import { errorResponse } from '../../error/error-responses';
import { ErrorMapping } from '../../error/error-responses-mapping';
import { StatusCode } from '../../utils/constants';
import Context from '../../utils/context';
import { IvsConnection } from '../../utils/database';
import HaaBaseService from '../haa-base.service';

export default class ExchangePostService extends HaaBaseService<ExchangePostDao> {
  constructor(context: Context) {
    super({ context, dao: new ExchangePostDao({ context }) });
  }

  async mapToEntityQueryParams(requestParam: RequestParam): Promise<ExchangeAddQueryParam> {
    const queryParam: ExchangeAddQueryParam = <ExchangeAddQueryParam>(
      this.mapToEntityQueryParamsCommon(requestParam)
    );
    const entity: ExchangePostEntity = ExchangePostMap.dtoToEntityForCreate(requestParam);

    for await (const npaItem of entity.npa) {
      npaItem.bnemNpaExchId = await this.dao.getNpaExchId();
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
    // params && (response.result = params);
    if (params) {
      response.result = {
        abbrev: params.abbrev,
        bookNum: params.bookNum,
        createdUserId: params.createdUserId,
        exchangeFullName: params.exchangeFullName,
        lastUpdatedUserId: params.lastUpdatedUserId,
        npa: params.npa,
        secondAbbrev: params.secondAbbrev,
        sectionNum: params.sectionNum
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
      const bnemNpa = item.bnemNpa;
      if (!bnemNpa) {
        errors.push(errorResponse(ErrorMapping.IVSHAA4404, this.context, { item }));
      }
      npaSet.add(item.bnemNpa);
    }

    if (npa.length !== npaSet.size) {
      errors.push(errorResponse(ErrorMapping.IVSHAA4420, this.context, { npa, bnemNpas: Array.from(npaSet) }));
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
    this.log.debug('ExchangePostService.executeTask connection retrieved: ', this.conn);
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
      this.log.error('ExchangePostService.executeTask error occured:', error);
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
          this.log.debug('ExchangePostService.executeTask connection closed');
          this.conn = undefined;
        } catch (err) {
          this.log.error('ExchangePostService.executeTask finally with error!', err);
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
