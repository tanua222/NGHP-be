import e from 'express';
import ExchangeUpdateDao from '../../dao/exchange/exchange-update.dao';
import ExchangeGetDto from '../../domain/dto/exchange/exchange-get.dto';
import { HaaBaseDto, RequestParam } from '../../domain/dto/haa-common.dto';
import ResponseDto from '../../domain/dto/response.dto';
import { ExchangeUpdateMap } from '../../domain/dtoEntityMap/exchange/exchange-update.map';
import { NpaExchangeAddEntity } from '../../domain/entities/exchange/exchange-add.entity';
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

      const npaListFromDb: NpaExchangeGetEntity[] = await this.executeGetNpaByExchangeDaoTask(localParams);

      if (!exchange.npa || exchange.npa.length === 0) {
        // updated exchange shouldn't have npa so execute SQL query for deletion
        return await this.deleteByAbbreviation(localParams, npaListFromDb)
      } else {
        const npaListForDeletion: number[] = new Array();
        // ADD new NPAs
        await this.addNewNpa(localParams, npaListFromDb, npaListForDeletion);
        // DELETE missing NPAs from DB that relates to the current exchange.abbreviation
        await this.deleteMissingNpa(localParams, npaListForDeletion);
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

  async addNewNpa(params: any, npaListFromDb: NpaExchangeGetEntity[], npaListForDeletion: number[]) {
    for await (const npaExchangeFromExchangeEntity of params.npa) {
      let exists = false;
      // marking NPA for deletion or creation
      if (npaListFromDb && npaListFromDb.length > 0) {
        for await (const npaFromDb of npaListFromDb) {
          if (npaExchangeFromExchangeEntity.npa === npaFromDb.npa) {
            exists = true;
            break;
          }
        }
        // checking if NPA exists in DB
        const existsInDb = (await this.dao.npaExists({ npa: npaExchangeFromExchangeEntity }, this.conn)) > 0;
        // creating NPA if it doesn't exist yet
        if (!exists) {
          npaListForDeletion.push(npaExchangeFromExchangeEntity.id);
          if (existsInDb) {
            const npaExchange = new NpaExchangeAddEntity();
            npaExchange.id = await this.dao.getNpaExchId();
            npaExchange.npa = npaExchangeFromExchangeEntity;
            npaExchange.abbreviation = params.abbreviation;
            npaExchange.createdUserId = params.createdUserId;
            npaExchange.lastUpdatedUserId = params.lastUpdatedUserId;
            // todo create and add item to a new list for the future insert. then execute a multiple sql insert
            await this.dao.addNpaExchange(npaExchange, this.conn);
          }
        }
      }
    }
  }

  async deleteMissingNpa(params: any, npaListForDeletion: number[]) {
    if (npaListForDeletion) {
      // todo execute a multiple sql delete
      for await (const npaExchangeId of npaListForDeletion) {
        await this.deleteByNpaExchange({ ...params, npaExchangeId });
      }
    }
  }

  async deleteByNpaExchange(params: any) {
    await this.dao.executeDeletedeleteByNpaExchange(params, this.conn)
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
