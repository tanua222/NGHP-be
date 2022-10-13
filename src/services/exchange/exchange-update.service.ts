import ExchangeUpdateDao from '../../dao/exchange/exchange-update.dao';
import ExchangeGetDto from '../../domain/dto/exchange/exchange-get.dto';
import { HaaBaseDto, RequestParam } from '../../domain/dto/haa-common.dto';
import ResponseDto, { Error } from '../../domain/dto/response.dto';
import { ExchangeUpdateMap } from '../../domain/dtoEntityMap/exchange/exchange-update.map';
import { NpaExchangeAddEntity } from '../../domain/entities/exchange/exchange-add.entity';
import { NpaExchangeGetEntity } from '../../domain/entities/exchange/exchange-get.entity';
import ExchangeUpdateEntity from '../../domain/entities/exchange/exchange-update.entity';
import { ExchangeUpdateQueryParam } from '../../domain/entities/haa-query-param.entity';
import { errorResponse } from '../../error/error-responses';
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
      await this.validateInput(params);

      params = await this.mapToEntityQueryParams(params);
      this.log.debug(`params`, params);

      await this.executeUpdateExchange(params);

      await this.conn.commit();
      this.log.debug(`data committed`);

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

      const npaListFromDb: NpaExchangeGetEntity[] = await this.executeGetNpaByExchangeDaoTask(localParams);

      if (!exchange.npa || exchange.npa.length === 0) {
        // updated exchange shouldn't have npa so execute SQL query for deletion
        return await this.deleteByAbbreviation(localParams, npaListFromDb)
      } else {
        // ADD new NPAs
        await this.addNewNpa(localParams, npaListFromDb);
        // DELETE missing NPAs from DB that relates to the current exchange.abbreviation
        await this.deleteMissingNpa(localParams, npaListFromDb);
      }
    }
  }

  async mapToEntityQueryParams(requestParam: RequestParam): Promise<ExchangeUpdateQueryParam> {
    const queryParam: ExchangeUpdateQueryParam = <ExchangeUpdateQueryParam>(
      this.mapToEntityQueryParamsCommon(requestParam)
    );
    const entities: ExchangeUpdateEntity[] = ExchangeUpdateMap.dtoToEntityForUpdate(requestParam);
    queryParam.entities = entities;

    return queryParam;
  }

  async addNewNpa(params: any, npaListFromDb: NpaExchangeGetEntity[]) {
    for await (const npaExchangeFromExchangeEntity of params.npa) {
      let exists = false;
      // marking NPA for deletion or creation
      if (npaListFromDb) {
        for (const npaFromDb of npaListFromDb) {
          if (npaExchangeFromExchangeEntity.npa === npaFromDb.npa) {
            exists = true;
            break;
          }
        }
        // creating NPA if it doesn't exist yet
        if (!exists) {
          const npaExchange = new NpaExchangeAddEntity();
          npaExchange.id = await this.dao.getNpaExchId();
          npaExchange.npa = npaExchangeFromExchangeEntity.npa;
          npaExchange.abbreviation = params.abbreviation;
          npaExchange.createdUserId = params.createdUserId;
          npaExchange.lastUpdatedUserId = params.lastUpdatedUserId;
          // todo create and add item to a new list for the future insert. then execute a multiple sql insert
          await this.dao.addNpaExchange(npaExchange, this.conn);
        }
      }
    }
  }

  async deleteMissingNpa(params: any, npaListFromDb: NpaExchangeGetEntity[]) {
    for await (const npaFromDb of npaListFromDb) {
      let exists = false;
      // marking NPA for deletion or creation
      if (npaListFromDb) {
        for (const npaExchangeFromExchangeEntity of params.npa) {
          if (npaExchangeFromExchangeEntity.npa === npaFromDb.npa) {
            exists = true;
            break;
          }
        }
        if (!exists) {
          // todo add to list then execute a multiple sql delete
          await this.deleteByNpaExchange({ ...params, npaExchangeId: npaFromDb.id });
        }
      }
    }
  }

  async deleteByNpaExchange(params: any) {
    await this.dao.executeDeleteByNpaExchange(params, this.conn)
  }

  async deleteByAbbreviation(params: any, npaList: NpaExchangeGetEntity[]) {
    let result;
    if (npaList && npaList.length > 0) {
      result = await this.dao.executeDeleteByAbbreviation(params, this.conn)
    }
    return result;
  }

  async executeGetNpaByExchangeDaoTask(params: any) {
    return await this.dao.executeGetNpaByExchange(params)
  }

  async executeUpdateExchangeDaoTask(params: any) {
    return await this.dao.updateExchange(params, this.conn);
  }

  async executeCountNpaDaoTask(params: any) {
    return await this.dao.countNpa(params, this.conn);
  }

  getResponse(params: ExchangeUpdateQueryParam): ResponseDto<HaaBaseDto> {
    let response = new ResponseDto<HaaBaseDto>();
    response.reponseCode(StatusCode.NO_CONTENT);
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
    
    const exchangeList: ExchangeUpdateEntity[] = params.inputRequest;
    const npaSet = this.validateExchange(exchangeList, errors);
    
    await this.validateNpaSet(params, npaSet, errors);

    if (errors.length > 0) {
      return ResponseDto.returnValidationErrors(errors);
    }
  }

  async validateNpaSet(params: any, npaSet: any, errors: Error[]) {
    params.npaList = Array.from(npaSet).join();
    let existedNpa = await this.executeCountNpaDaoTask(params);
    existedNpa = existedNpa[0];

    if (npaSet.size !== existedNpa) {
      errors.push(errorResponse(ErrorMapping.IVSHAA4438, this.context, { npa: params.npaList }));
      return ResponseDto.returnValidationErrors(errors);
    }
  }

  validateNpaList(npaList: any, errors: Error[]): any {
    if (!npaList || npaList.length === 0) {
      errors.push(errorResponse(ErrorMapping.IVSHAA4404, this.context, { npa: [] }));
      return ResponseDto.returnValidationErrors(errors);
    }

    const npaSetLocal = new Set();

    for (const item of npaList) {
      const npa = item.npa;
      if (!npa) {
        errors.push(errorResponse(ErrorMapping.IVSHAA4404, this.context, { item }));
      }
      npaSetLocal.add(item.npa);
    }

    if (npaList.length !== npaSetLocal.size) {
      errors.push(errorResponse(ErrorMapping.IVSHAA4420, this.context, { npa: npaList, npas: Array.from(npaSetLocal) }));
    }

    if (errors.length > 0) {
      return ResponseDto.returnValidationErrors(errors);
    }
    return npaSetLocal;
  }

  validateExchange(exchangeList: any, errors: Error[]) {
    if (!exchangeList || exchangeList.length === 0) {
      errors.push(errorResponse(ErrorMapping.IVSHAA4404, this.context, { npa: [] }));
      return ResponseDto.returnValidationErrors(errors);
    }
    const abbreviationSet = new Set();

    for (const exchange of exchangeList) {
      const abbreviation = exchange.abbreviation;
      if (!abbreviation) {
        errors.push(errorResponse(ErrorMapping.IVSHAA4404, this.context, { item: exchange }));
      }
      abbreviationSet.add(abbreviation);
    }
    if (exchangeList.length !== abbreviationSet.size) {
      errors.push(errorResponse(ErrorMapping.IVSHAA4420, this.context, { npa: exchangeList, npas: Array.from(abbreviationSet) }));
    }

    let npaSet = new Set();
    
    for (const exchange of exchangeList) {
      const npaList = exchange.npa;
      const tempSet = this.validateNpaList(npaList, errors);
      npaSet = new Set([...npaSet, ...tempSet]);
    }
    return npaSet;
  }

}
