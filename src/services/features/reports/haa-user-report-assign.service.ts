import { RequestParam, UserReportAssignInputRequestParam } from '../../../domain/dto/haa-common.dto';
import ResponseDto from '../../../domain/dto/response.dto';
import HaaAssignedUserReportEntity from '../../../domain/entities/haa-assigned-user-report.entity';
import { ErrorMapping } from '../../../error/error-responses-mapping';
import { StatusCode } from '../../../utils/constants';
import HaaUserReportService from './haa-user-report.service';
import HaaUserReportValidatorService from '../../validator/reports/haa-user-report-validation.service';
import HaaQueryParams from '../../../domain/entities/haa-query-param.entity';

export default class HaaUserReportAssignService extends HaaUserReportService {
  validateResult({ rowsAffected, expectedRowsAffected }: any) {
    if (rowsAffected < expectedRowsAffected) {
      throw ResponseDto.internalErrorCode(this.context, ErrorMapping.IVSHAA4417);
      // throw ResponseDto.internalError(
      //   'This report type has previously been assigned to this user. Modify the existing report'
      // );
    }
  }
  mapDtoToEntity(requestParam: RequestParam): HaaAssignedUserReportEntity[] {
    const inputReport = <UserReportAssignInputRequestParam>requestParam.inputRequest;

    return inputReport.reportId.map((id) => {
      const report = new HaaAssignedUserReportEntity();
      report.hierarchyNodeId = inputReport.parentHierarchyNodeId;
      report.reportId = id;
      report.formatCode = inputReport.format;
      report.reportLanCode = inputReport.language;
      report.recipientUserId = inputReport.recipientUserId;

      return report;
    });
  }

  async executeDaoTask(params: any) {
    return await this.dao.assignUserReport(params, this.conn);
  }

  getResponse() {
    const response = new ResponseDto();
    response.reponseCode(StatusCode.CREATED);
    return response;
  }

  async validateInput(queryParams: HaaQueryParams) {
    const validationService = new HaaUserReportValidatorService(this.dao);
    await validationService.validateInputForAssign(queryParams);
  }
}
