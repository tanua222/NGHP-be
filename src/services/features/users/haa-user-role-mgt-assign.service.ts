import ResponseDto from '../../../domain/dto/response.dto';
import { StatusCode } from '../../../utils/constants';
import HaaUserRoleMgtService from './haa-user-role-mgt.service';

export default class HaaUserRoleMgtAssignService extends HaaUserRoleMgtService {
  async executeDaoTask(params: any) {
    await this.dao.assignUserToNode(params, this.conn);
  }

  getResponse() {
    const response = new ResponseDto();
    response.reponseCode(StatusCode.CREATED);
    return response;
  }
}
