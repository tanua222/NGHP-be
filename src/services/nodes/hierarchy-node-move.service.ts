import { NodeMoveInputRequestParam, RequestParam } from '../../domain/dto/haa-common.dto';
import HierarchyNodeService from './hierachy-node.service';
import HierarchyNodeEntity from '../../domain/entities/hierarchy-node.entity';
import ResponseDto from '../../domain/dto/response.dto';
import { StatusCode } from '../../utils/constants';
import HaaQueryParams from '../../domain/entities/haa-query-param.entity';
import HierarchyNodeValidatorService from '../validator/nodes/hierarchy-node-validation.service';

export default class HierarchyNodeMoveService extends HierarchyNodeService {
  mapDtoToEntity(requestParam: RequestParam): HierarchyNodeEntity[] {
    const input: NodeMoveInputRequestParam = requestParam.inputRequest;
    const inputNodes = input?.nodeId || [];

    return inputNodes.map((id) => {
      const entity = new HierarchyNodeEntity();
      entity.ndeId = id;
      entity.parentHierarchyId = input.targetParentHierarchyNodeId;

      return entity;
    });
  }

  async executeDaoTask(params: any) {
    return await this.dao.moveNode(params, this.conn);
  }

  getResponse() {
    const response = new ResponseDto();
    response.reponseCode(StatusCode.SUCCESS);
    return response;
  }

  async validateInput(queryParams: HaaQueryParams) {
    const validationService = new HierarchyNodeValidatorService(this.dao);
    await validationService.validateInputForMove(queryParams);
  }
}
