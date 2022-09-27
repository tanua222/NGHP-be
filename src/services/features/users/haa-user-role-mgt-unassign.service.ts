import { RequestParam } from '../../../domain/dto/haa-common.dto';
import BaseEntity from '../../../domain/entities/base.entity';
import HaaUserRoleMgtService from './haa-user-role-mgt.service';

export default class HaaUserRoleMgtUnassignService extends HaaUserRoleMgtService {
  async executeDaoTask(params: any) {
    await this.dao.unassignUserFromNode(params, this.conn);
  }

  mapDtoToEntity(requestParam: RequestParam): BaseEntity[] {
    return requestParam.inputRequest;
  }
}
