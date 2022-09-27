import { RequestParam, WtnMoveInputRequestParam } from '../../../domain/dto/haa-common.dto';
import ResponseDto from '../../../domain/dto/response.dto';
import HierarchyWtnEntity from '../../../domain/entities/hierarchy-wtn.entity';
import { StatusCode } from '../../../utils/constants';
import HierarchyWtnService from './hierachy-wtn.service';

export default class HierarchyWtnMoveService extends HierarchyWtnService {
  mapDtoToEntity(requestParam: RequestParam): HierarchyWtnEntity[] {
    const input: WtnMoveInputRequestParam = requestParam.inputRequest;
    const inputWtnNodes = input.wtnNodeId;

    return inputWtnNodes.map((id) => {
      const entity = new HierarchyWtnEntity();
      entity.nodeId = id;
      entity.parentHierarchyId = input.targetParentHierarchyNodeId;

      return entity;
    });
  }

  async executeDaoTask(params: any) {
    return await this.dao.moveWtn(params, this.conn);
  }

  getResponse() {
    const response = new ResponseDto();
    response.reponseCode(StatusCode.SUCCESS);
    return response;
  }
}
