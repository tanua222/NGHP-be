import ExchangeUpdateDao from '../../dao/exchange/exchange-update.dao';
import ExchangeGetDto from '../../domain/dto/exchange/exchange-get.dto';
import { HaaBaseDto, RequestParam } from '../../domain/dto/haa-common.dto';
import ResponseDto from '../../domain/dto/response.dto';
import { ExchangeUpdateMap } from '../../domain/dtoEntityMap/exchange/exchange-update.map';
import { NpaExchangeGetEntity } from '../../domain/entities/exchange/exchange-get.entity';
import ExchangeUpdateEntity from '../../domain/entities/exchange/exchange-update.entity';
import { ExchangeUpdateQueryParam } from '../../domain/entities/haa-query-param.entity';
import { ErrorMapping } from '../../error/error-responses-mapping';
import { StatusCode } from '../../utils/constants';
import Context from '../../utils/context';
import { IvsConnection } from '../../utils/database';
import HaaBaseService from '../haa-base.service';

export default class ExchangeUpdateService extends HaaBaseService<ExchangeUpdateDao> {
  constructor(context: Context) {
    super({ context, dao: new ExchangeUpdateDao({ context }) });
  }

  async executeTask(args: any): Promise<ResponseDto<any>> {
    this.conn = await IvsConnection.getConnection(this.dao.dbConfig, this.context);
    this.log.debug('ExchangeUpdateService.executeTask connection retrieved: ', this.conn);
    try {
      let params = args.params;

      // fixme
      // await this.validateInput(params);

      params = await this.mapToEntityQueryParams(params);

      this.log.debug(`params`, params);

      let result = await this.executeUpdateExchange(params);

      // if (result) {
      console.log(result);
      //   result.expectedRowsAffected = 1;
      //   this.validateResult(result);

      //   result = await this.executeUpdateNpaExchangesDaoTask(params);

      //   if (result) {
      //     result.expectedRowsAffected = params?.npa.length || 0;
      //     this.validateResult(result);
      //   }
      await this.conn.commit();
      this.log.debug(`data committed`);
      // }

      return this.getResponse(params);
    } catch (error) {
      this.log.error('ExchangeUpdateService.executeTask error occured:', error);
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
          this.log.debug('ExchangeUpdateService.executeTask connection closed');
          this.conn = undefined;
        } catch (err) {
          this.log.error('ExchangeUpdateService.executeTask finally with error!', err);
        }
      }
    }
  }

  async executeUpdateExchange(params: ExchangeUpdateQueryParam) {
    const localParams = { ...params };
    for await (const exchange of params.entities) {
      Object.assign(localParams, exchange);
      const result = await this.executeUpdateExchangeDaoTask(localParams);
      // validate result

      const npaList: NpaExchangeGetEntity[] = await this.executeGetNpaByExchangeDaoTask(localParams);
      // List<NpaExchange> npaeList =  npaExchangeMapper.getByExchange(exchange);

      console.log(npaList);
    }

    return { result: "" }
  }

  async mapToEntityQueryParams(requestParam: RequestParam): Promise<ExchangeUpdateQueryParam> {
    const queryParam: ExchangeUpdateQueryParam = <ExchangeUpdateQueryParam>(
      this.mapToEntityQueryParamsCommon(requestParam)
    );
    const entities: ExchangeUpdateEntity[] = ExchangeUpdateMap.dtoToEntityForUpdate(requestParam);
    queryParam.entities = entities;

    return queryParam;
  }

  async executeGetNpaByExchangeDaoTask(params: any) {
    return await this.dao.executeGetNpaByExchange(params, this.conn)
  }

  async executeUpdateExchangeDaoTask(params: any) {
    return await this.dao.updateExchange(params, this.conn);
  }

  async executeCountNpaDaoTask(params: any) {
    return await this.dao.countNpa(params, this.conn);
  }

  // fixme
  async executeUpdateNpaExchangesDaoTask(params: any) {
    // params.rowsAffected = 0;
    // for await (const npaItem of params.npa) {
    //   const insertResult = await this.dao.addNpaExchange(npaItem, this.conn);
    //   params.rowsAffected += insertResult?.rowsAffected || 0;
    // }
    return params;
  }

  getResponse(params: ExchangeUpdateQueryParam): ResponseDto<HaaBaseDto> {
    let response = new ResponseDto<HaaBaseDto>();
    response.reponseCode(StatusCode.NO_CONTENT);
    return response;
  }
  mapQueryParamsToDto(params: any): ResponseDto<ExchangeGetDto> {
    let response = new ResponseDto<ExchangeGetDto>();
    // params && (response.result = params);
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

  // fixme
  async validateInput(params: any): Promise<void> {
    // const errors: Error[] = [];
    // const npa = params.inputRequest?.npa;

    // if (!npa || npa.length === 0) {
    //   errors.push(errorResponse(ErrorMapping.IVSHAA4404, this.context, { npa: [] }));
    //   return ResponseDto.returnValidationErrors(errors);
    // }
    // const npaSet = new Set();

    // for (const item of npa) {
    //   const npa = item.npa;
    //   if (!npa) {
    //     errors.push(errorResponse(ErrorMapping.IVSHAA4404, this.context, { item }));
    //   }
    //   npaSet.add(item.npa);
    // }

    // if (npa.length !== npaSet.size) {
    //   errors.push(errorResponse(ErrorMapping.IVSHAA4420, this.context, { npa, npas: Array.from(npaSet) }));
    // }

    // if (errors.length > 0) {
    //   return ResponseDto.returnValidationErrors(errors);
    // }

    // params.npaList = Array.from(npaSet).join();
    // const existedNpa = await this.executeCountNpaDaoTask(params);

    // if (npa.length !== existedNpa[0]) {
    //   errors.push(errorResponse(ErrorMapping.IVSHAA4404, this.context, { npa: [] }));
    //   return ResponseDto.returnValidationErrors(errors);
    // }
  }

  validateResult({ rowsAffected, expectedRowsAffected }: any) {
    if (rowsAffected < expectedRowsAffected) {
      throw ResponseDto.internalErrorCode(this.context, ErrorMapping.IVSHAA4417);
    }
  }


}
