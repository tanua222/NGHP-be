import ExchangeDeleteDao from '../../dao/exchange/exchange-delete.dao';
import { HaaBaseDto } from '../../domain/dto/haa-common.dto';
import ResponseDto, { Error } from '../../domain/dto/response.dto';
import { ExchangeUpdateQueryParam } from '../../domain/entities/haa-query-param.entity';
import { errorResponse } from '../../error/error-responses';
import { ErrorMapping } from '../../error/error-responses-mapping';
import { StatusCode } from '../../utils/constants';
import Context from '../../utils/context';
import { IvsConnection } from '../../utils/database';
import HaaBaseService from '../haa-base.service';

export default class ExchangeDeleteService extends HaaBaseService<ExchangeDeleteDao> {
  constructor(context: Context) {
    super({ context, dao: new ExchangeDeleteDao({ context }) });
  }

  async executeTask(args: any): Promise<ResponseDto<any>> {
    this.conn = await IvsConnection.getConnection(this.dao.dbConfig, this.context);
    this.log.debug('ExchangeDeleteService.executeTask connection retrieved: ', this.conn);
    try {
      let params = args.params;

      this.log.debug(`params`, params);

      await this.validateInput(params);

      await this.executeDeleteExchange(params);

      await this.conn.commit();
      this.log.debug(`data committed`);

      return this.getResponse();
    } catch (error) {
      this.log.error('ExchangeDeleteService.executeTask error occured:', error);
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
          this.log.debug('ExchangeDeleteService.executeTask connection closed');
          this.conn = undefined;
        } catch (err) {
          this.log.error('ExchangeDeleteService.executeTask finally with error!', err);
        }
      }
    }
  }

  async executeDeleteExchange(params: any) {
    params.abbreviations = params.inputRequest.abbreviations.join(`','`);

    await this.executeDeleteMultipleNpaExchangesByAbbreviation(params);
    await this.executeDeleteMultipleExchangesByAbbreviation(params);
  }

  async executeDeleteMultipleNpaExchangesByAbbreviation(params: any, conn?: IvsConnection) {
    return await this.dao.executeDeleteMultipleNpaExchangesByAbbreviation(params, this.conn)
  }

  async executeDeleteMultipleExchangesByAbbreviation(params: any, conn?: IvsConnection) {
    return await this.dao.executeDeleteMultipleExchangesByAbbreviation(params, this.conn)
  }

  async validateInput(params: any) {
    const abbreviations = params.inputRequest?.abbreviations;
    const errors: Error[] = [];
    if (!abbreviations || abbreviations.length === 0) {
      errors.push(errorResponse(ErrorMapping.IVSHAA4404, this.context, { abbreviations: [] }));
      ResponseDto.returnValidationErrors(errors);
    }
  }

  getResponse(): ResponseDto<HaaBaseDto> {
    let response = new ResponseDto<HaaBaseDto>();
    response.reponseCode(StatusCode.NO_CONTENT);
    return response;
  }

}
