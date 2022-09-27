import {
  NodeEntityAssignInputRequestParam,
  RequestParam,
  NodeEntityRequestParam,
} from '../../../domain/dto/haa-common.dto';
import ResponseDto from '../../../domain/dto/response.dto';
import BaseEntity from '../../../domain/entities/base.entity';
import HaaQueryParams from '../../../domain/entities/haa-query-param.entity';
import { StatusCode } from '../../../utils/constants';
import HaaEntityValidatorService from '../../validator/features/entities/haa-entity-validation.service';
import HaaEntityService from './haa-entity.service';

export default class HaaEntityAssignService extends HaaEntityService {
  mapDtoToEntity(requestParam: NodeEntityRequestParam): BaseEntity[] {
    const inputRequests: NodeEntityAssignInputRequestParam[] = requestParam.inputRequest;
    return inputRequests.map((inputReq) => {
      const entity = new BaseEntity();
      entity.hierarchyNodeId = inputReq.parentHierarchyNodeId;
      entity.entitySequenceId = inputReq.entitySequenceId;
      entity.entityType = requestParam.entityType;
      return entity;
    });
  }

  async executeDaoTask(params: any) {
    return await this.dao.assign(params, this.conn);
  }

  getResponse() {
    const response = new ResponseDto();
    response.reponseCode(StatusCode.CREATED);
    return response;
  }

  async validateInput(queryParams: HaaQueryParams) {
    const validationService = new HaaEntityValidatorService(this.dao);
    await validationService.validateInputForAssign(queryParams);
  }
}
