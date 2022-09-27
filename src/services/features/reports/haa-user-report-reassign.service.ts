import { RequestParam, UserReportReassignInputRequestParam } from '../../../domain/dto/haa-common.dto';
import ResponseDto from '../../../domain/dto/response.dto';
import HaaAssignedUserReportEntity from '../../../domain/entities/haa-assigned-user-report.entity';
import { StatusCode } from '../../../utils/constants';
import HaaUserReportService from './haa-user-report.service';
import { ErrorMapping } from '../../../error/error-responses-mapping';

export default class HaaUserReportReassignService extends HaaUserReportService {
  validateResult({ rowsAffected, expectedRowsAffected }: any) {
    if (rowsAffected < expectedRowsAffected) {
      throw ResponseDto.internalErrorCode(this.context, ErrorMapping.IVSHAA4418);
    }
  }

  mapDtoToEntity(requestParam: RequestParam): HaaAssignedUserReportEntity[] {
    const input: UserReportReassignInputRequestParam = requestParam.inputRequest;
    const inputReports = input.assignedReportId;

    return inputReports.map((report) => {
      const entity = new HaaAssignedUserReportEntity();
      entity.assignedReportId = report;
      entity.recipientUserId = input.recipientUserId;

      return entity;
    });
  }

  async executeDaoTask(params: any) {
    return await this.dao.reassignUserReport(params, this.conn);
  }

  getResponse() {
    const response = new ResponseDto();
    response.reponseCode(StatusCode.SUCCESS);
    return response;
  }
}
