import HaaBaseDao from '../../../dao/haa-base.dao';
import HaaAssignableUserReportDto from '../../../domain/dto/haa-assignable-user-report.dto';
import { AssignedUserReportRequestParam, RequestParam } from '../../../domain/dto/haa-common.dto';
import ResponseDto, { Error } from '../../../domain/dto/response.dto';
import HaaAssignedUserReportEntity from '../../../domain/entities/haa-assigned-user-report.entity';
import HaaQueryParams, { HaaUserReportDetailQueryParam } from '../../../domain/entities/haa-query-param.entity';
import { errorResponse } from '../../../error/error-responses';
import { ErrorMapping } from '../../../error/error-responses-mapping';
import { BASE_CORP_NODE_LEVEL, Language, RAW_REPORTS } from '../../../utils/constants';
import HaaAssignableUserReportService from '../../features/reports/haa-assignable-user-report.service';
import HaaValidationService from '../haa-validation.service';
import HaaUserReportDao from '../../../dao/features/reports/haa-user-report.dao';
import HaaAssignedUserReportService from '../../features/reports/haa-assigned-user-report.service';
import HaaUserReportDetailService from '../../features/reports/haa-user-report-detail.service';
import HaaAssignedUserReportDto from '../../../domain/dto/haa-assigned-user-report.dto';
import { PaginationParam } from '../../../domain/dto/haa-common.dto';

export default class HaaUserReportValidatorService extends HaaValidationService {
  haaAssignableUserReportService: HaaAssignableUserReportService;
  haaUserReportDetailService: HaaUserReportDetailService;
  haaAssignedUserReportService: HaaAssignedUserReportService;
  haaUserReportDao: HaaUserReportDao;

  constructor(dao: HaaBaseDao) {
    super(dao);
    this.haaAssignableUserReportService = new HaaAssignableUserReportService(this.context);
    this.haaUserReportDetailService = new HaaUserReportDetailService(this.context);
    this.haaAssignedUserReportService = new HaaAssignedUserReportService(this.context);
    this.haaUserReportDao = new HaaUserReportDao({ context: this.context });
  }

  async validateInputForAssign(queryParams: HaaQueryParams): Promise<any> {
    const errors: Error[] = [];

    const results = await this.haaUserReportDao.getReportingPeriod(queryParams);
    const reportingPeriod = results?.[0].reportingPeriod;
    if (results.length && !reportingPeriod) {
      errors.push(errorResponse(ErrorMapping.IVSHAA4428, this.context));
      this.returnValidationErrors(errors);
    }

    const reportResult = <ResponseDto<HaaAssignableUserReportDto[]>>(
      await this.haaAssignableUserReportService.retrieveHaaEntity(new RequestParam())
    );
    const reports = reportResult.result || [];
    if (reports.length) {
      for (const entity of <HaaAssignedUserReportEntity[]>queryParams.entities) {
        const report = reports.find((report) => +report.reportId === entity.reportId);
        if (report && RAW_REPORTS.includes(report.reportCode) && entity.formatCode !== 'CSV') {
          errors.push(errorResponse(ErrorMapping.IVSHAA4425, this.context, { reportId: entity.reportId }));
        }
      }
    }

    this.returnValidationErrors(errors);
  }

  async validateInputForUpdate(queryParams: HaaUserReportDetailQueryParam): Promise<any> {
    const errors: Error[] = [];
    const input = { assignedReportId: queryParams.assignedReportId };

    const repPeriodParams = {
      ...queryParams,
      lan: Language.EN,
    };
    const repPeriodres = await this.haaUserReportDao.getReportingPeriod(repPeriodParams);
    const reportingPeriod = repPeriodres?.[0].reportingPeriod;
    if (repPeriodres.length && !reportingPeriod) {
      errors.push(errorResponse(ErrorMapping.IVSHAA4428, this.context, input));
    }

    const entity = new HaaAssignedUserReportEntity();
    const assignedReportParams = new HaaUserReportDetailQueryParam();
    entity.assignedReportId = input.assignedReportId!;
    assignedReportParams.lan = Language.EN;
    assignedReportParams.entities = [entity];
    assignedReportParams.loginUser = queryParams.loginUser;
    const assignedReportRes = await this.haaAssignedUserReportService.paginate({
      params: assignedReportParams,
      query: 'findByFilters',
    });
    let reportDetail = <HaaAssignedUserReportEntity>assignedReportRes.rows?.[0];
    if (reportDetail) {
      const inputEntity = <HaaAssignedUserReportEntity>queryParams.entities?.[0];
      const assignedParams = new AssignedUserReportRequestParam();
      assignedParams.language = inputEntity.reportLanCode || reportDetail.reportLanCode;
      assignedParams.recipientUserId = inputEntity.recipientUserId || reportDetail.recipientUserId;
      assignedParams.formatCode = inputEntity.formatCode || reportDetail.formatCode;
      assignedParams.parentHierarchyNodeId = reportDetail.hierarchyNodeId;
      assignedParams.parentHierarchyNodeName = reportDetail.hierarchyNodeName;
      assignedParams.reportCode = reportDetail.reportCode;
      assignedParams.reportDescription = reportDetail.reportDescription;
      assignedParams.paginationParam = new PaginationParam();
      assignedParams.paginationParam.ignoreServicePagination = true;
      assignedParams.paginationParam.paginationRequired = false;
      assignedParams.loginUser = queryParams.loginUser;
      const assignedRes = <ResponseDto<HaaAssignedUserReportDto[]>>(
        await this.haaAssignedUserReportService.retrieveHaaEntity(assignedParams)
      );
      const report = assignedRes.result?.[0];
      if (report && report.assignedReportId !== input.assignedReportId) {
        errors.push(errorResponse(ErrorMapping.IVSHAA4417, this.context, input));
      }
    } else {
      throw ResponseDto.notFoundError(this.context, input);
    }
    this.returnValidationErrors(errors);
  }
}
