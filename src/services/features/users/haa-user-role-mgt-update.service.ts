import ResponseDto from '../../../domain/dto/response.dto';
import HaaQueryParams from '../../../domain/entities/haa-query-param.entity';
import { ErrorMapping } from '../../../error/error-responses-mapping';
import { isEmpty } from '../../../utils/util';
import HaaUserRoleMgtService from './haa-user-role-mgt.service';

export default class HaaUserRoleMgtUpdateService extends HaaUserRoleMgtService {
  validateInput(haaQueryParams: HaaQueryParams) {
    this.log.info('HaaUserRoleMgtUpdateService validateInput()');

    if (haaQueryParams.entities?.length) {
      haaQueryParams.entities.forEach((e: any) => {
        const roleId = isEmpty(e.roleId) ? null : e.roleId;
        const cascadeInd = isEmpty(e.cascadeInd) ? null : e.cascadeInd;
        if (isEmpty(roleId) || isEmpty(cascadeInd)) {
          throw ResponseDto.badRequestErrorCode(this.context, ErrorMapping.IVSHAA4405, {
            roleId,
            cascadeInd,
          });
        }
      });
    }
  }

  async executeDaoTask(params: any) {
    await this.dao.updateAssignedUserRoleInNode(params, this.conn);
  }
}
