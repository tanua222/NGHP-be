import { RequestParam, UserReportUnassignInputRequestParam } from '../../../domain/dto/haa-common.dto';
import ResponseDto from '../../../domain/dto/response.dto';
import HaaAssignedUserReportEntity from '../../../domain/entities/haa-assigned-user-report.entity';
import { StatusCode } from '../../../utils/constants';
import HaaUserReportService from './haa-user-report.service';

export default class HaaUserReportUnassignService extends HaaUserReportService {
  mapDtoToEntity(requestParam: RequestParam): HaaAssignedUserReportEntity[] {
    const inputReports: UserReportUnassignInputRequestParam[] = requestParam.inputRequest;

    return inputReports.map((report) => {
      const entity = new HaaAssignedUserReportEntity();
      entity.assignedReportId = report.assignedReportId;

      return entity;
    });
  }

  async executeDaoTask(params: any) {
    return await this.dao.unassignUserReport(params, this.conn);
  }

  getResponse() {
    const response = new ResponseDto();
    response.reponseCode(StatusCode.SUCCESS);
    return response;
  }
}
