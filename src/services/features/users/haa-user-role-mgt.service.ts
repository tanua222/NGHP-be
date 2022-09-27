import HaaUserRoleMgtDao from '../../../dao/features/haa-user-role-mgt.dao';
import { RequestParam } from '../../../domain/dto/haa-common.dto';
import ResponseDto from '../../../domain/dto/response.dto';
import BaseEntity from '../../../domain/entities/base.entity';
import { ErrorMapping } from '../../../error/error-responses-mapping';
import Context from '../../../utils/context';
import { IvsConnection } from '../../../utils/database';
import { isEmpty } from '../../../utils/util';
import HaaBaseService from '../../haa-base.service';

export default class HaaUserRoleMgtService extends HaaBaseService<HaaUserRoleMgtDao> {
  constructor(context: Context) {
    super({ context, dao: new HaaUserRoleMgtDao({ context }) });
  }

  async executeTask(args: any): Promise<ResponseDto<any>> {
    this.conn = await IvsConnection.getConnection(this.dao.dbConfig, this.context);
    this.log.debug('HaaUserRoleMgtService.executeTask connection retrieved: ', this.conn);
    try {
      const params = await this.mapToEntityQueryParams(args.params);
      this.log.debug(`params`, params);

      this.validateInput(params);

      await this.executeDaoTask(params);

      await this.conn.commit();
      this.log.debug(`data committed`);

      return this.getResponse();
    } catch (error) {
      this.log.error('HaaUserRoleMgtService.executeTask error occured:', error);
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
          this.log.debug('HaaUserRoleMgtService.executeTask connection closed');
          this.conn = undefined;
        } catch (err) {
          this.log.error('HaaUserRoleMgtService.executeTask finally with error!', err);
        }
      }
    }
  }

  mapDtoToEntity(requestParam: RequestParam): BaseEntity[] {
    // extract roles from body (inputRequest)
    const roles: any[] = requestParam.inputRequest?.role || [];
    const cleanedRoles: any[] = [];

    const invalid = roles.some((role) => isEmpty(role.roleId) || isEmpty(role.cascadeInd));
    if (invalid) {
      // cancel role cleaning, this will be validated in next step
      return roles;
    }

    for (const role of roles) {
      // check if roles has duplicate (e.g. [{roleId: 1, cascadeInd: Y}, {roleId: 1, cascadeInd: N}] )
      const arr = roles.filter((r) => r.roleId == role.roleId);
      if (arr.length === 1) {
        // no duplicate
        cleanedRoles.push({
          roleId: String(role.roleId),
          cascadeInd: role.cascadeInd,
        });
      } else if (arr.length > 1 && !cleanedRoles.find((r) => r.roleId == role.roleId)) {
        // has duplicate and not added to list yet, prioritize cascadeInd==='Y'
        const cascade = arr.some((r) => r.cascadeInd === 'Y');
        cleanedRoles.push({
          roleId: String(role.roleId),
          cascadeInd: cascade ? 'Y' : 'N',
        });
      }
    }
    return cleanedRoles;
  }

  async executeDaoTask(params: any) {
    throw new Error('Method not implemented: executeDaoTask()');
  }

  getResponse() {
    return new ResponseDto();
  }
}
