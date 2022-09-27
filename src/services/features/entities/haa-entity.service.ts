import HaaEntityDao from '../../../dao/features/entities/haa-entity.dao';
import { RequestParam } from '../../../domain/dto/haa-common.dto';
import ResponseDto from '../../../domain/dto/response.dto';
import BaseEntity from '../../../domain/entities/base.entity';
import HaaQueryParams from '../../../domain/entities/haa-query-param.entity';
import { ErrorMapping } from '../../../error/error-responses-mapping';
import Context from '../../../utils/context';
import { IvsConnection } from '../../../utils/database';
import HaaBaseService from '../../haa-base.service';

export default abstract class HaaEntityService extends HaaBaseService<HaaEntityDao> {
  constructor(context: Context) {
    super({ context, dao: new HaaEntityDao({ context }) });
  }

  async executeTask(args: any): Promise<ResponseDto<any>> {
    this.conn = await IvsConnection.getConnection(this.dao.dbConfig, this.context);
    this.log.debug('HaaEntityService.executeTask connection retrieved: ', this.conn);
    try {
      const params = await this.mapToEntityQueryParams(args.params);
      this.log.debug(`params`, params);

      await this.validateInput(params);

      await this.executeDaoTask(params);

      await this.conn.commit();
      this.log.debug(`data committed`);

      return this.getResponse();
    } catch (error) {
      this.log.error('HaaEntityService.executeTask error occured:', error);
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
          this.log.debug('HaaEntityService.executeTask connection closed');
          this.conn = undefined;
        } catch (err) {
          this.log.error('HaaEntityService.executeTask finally with error!', err);
        }
      }
    }
  }

  abstract mapDtoToEntity(requestParam: RequestParam): BaseEntity[];
  abstract executeDaoTask(params: any): Promise<any>;

  async validateInput(_queryParams: HaaQueryParams) {
    return;
  }

  getResponse() {
    return new ResponseDto();
  }
}
