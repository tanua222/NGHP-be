import HierarchyWtnDao from '../../../dao/features/wtn/hierarchy-wtn.dao';
import { RequestParam } from '../../../domain/dto/haa-common.dto';
import ResponseDto from '../../../domain/dto/response.dto';
import BaseEntity from '../../../domain/entities/base.entity';
import { ErrorMapping } from '../../../error/error-responses-mapping';
import Context from '../../../utils/context';
import { IvsConnection } from '../../../utils/database';
import HaaBaseService from '../../haa-base.service';

export default abstract class HierarchyWtnService extends HaaBaseService<HierarchyWtnDao> {
  constructor(context: Context) {
    super({ context, dao: new HierarchyWtnDao({ context }) });
  }

  async executeTask(args: any): Promise<ResponseDto<any>> {
    this.conn = await IvsConnection.getConnection(this.dao.dbConfig, this.context);
    this.log.debug('HierarchyWtnService.executeTask connection retrieved: ', this.conn);
    try {
      const params = await this.mapToEntityQueryParams(args.params);
      this.log.debug(`params`, params);

      const result = await this.executeDaoTask(params);

      if (result) {
        result.expectedRowsAffected = params?.entities.length || 0;
        this.validateResult(result);

        await this.conn.commit();
        this.log.debug(`data committed`);
      }

      return this.getResponse();
    } catch (error) {
      this.log.error('HierarchyWtnService.executeTask error occured:', error);
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
          this.log.debug('HierarchyWtnService.executeTask connection closed');
          this.conn = undefined;
        } catch (err) {
          this.log.error('HierarchyWtnService.executeTask finally with error!', err);
        }
      }
    }
  }

  abstract mapDtoToEntity(requestParam: RequestParam): BaseEntity[];
  abstract executeDaoTask(params: any): Promise<any>;

  validateResult(_result: any) {
    return;
  }

  getResponse() {
    return new ResponseDto();
  }
}
