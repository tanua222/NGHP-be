import { RequestParam, NodeEntityUnassignInputRequestParam } from '../../../domain/dto/haa-common.dto';
import ResponseDto from '../../../domain/dto/response.dto';
import BaseEntity from '../../../domain/entities/base.entity';
import HaaQueryParams from '../../../domain/entities/haa-query-param.entity';
import { StatusCode } from '../../../utils/constants';
import HaaEntityValidatorService from '../../validator/features/entities/haa-entity-validation.service';
import HaaEntityService from './haa-entity.service';

export default class HaaEntityUnassignService extends HaaEntityService {
  mapDtoToEntity(requestParam: RequestParam): BaseEntity[] {
    const inputRequests: NodeEntityUnassignInputRequestParam[] = requestParam.inputRequest;
    return inputRequests.map((inputReq) => {
      const entity = new BaseEntity();
      entity.entityNodeId = inputReq.entityNodeId;
      return entity;
    });
  }

  async executeDaoTask(params: any) {
    return await this.dao.unassign(params, this.conn);
  }

  getResponse() {
    const response = new ResponseDto();
    response.reponseCode(StatusCode.SUCCESS);
    return response;
  }

  async validateInput(queryParams: HaaQueryParams) {
    const validationService = new HaaEntityValidatorService(this.dao);
    await validationService.validateInputForUnassign(queryParams);
  }
}
