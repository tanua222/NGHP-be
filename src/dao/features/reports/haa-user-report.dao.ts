import ResponseDto, { Error } from '../../../domain/dto/response.dto';
import HaaAssignedUserReportEntity from '../../../domain/entities/haa-assigned-user-report.entity';
import { ErrorMapping } from '../../../error/error-responses-mapping';
import { IvsConnection } from '../../../utils/database';
import { BaseDaoOptions } from '../../base.dao';
import HaaBaseDao from '../../haa-base.dao';
import HaaAssignedUserReportDao from './haa-assigned-user-report.dao';

export default class HaaUserReportDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      mapperNamespace: 'haaUserReportMapper',
      ...options,
    });
  }

  async getReportingPeriod(params: any) {
    const dbResult = await this.findByFilters({
      query: 'getReportingPeriod',
      params,
    });

    return HaaAssignedUserReportEntity.transform(dbResult);
  }

  async assignUserReport(params: any, conn?: IvsConnection) {
    const mapperId = 'assignUserReport';

    if (!conn) throw Error.noDbConnection(this.dbConfig.poolAlias, mapperId);
    return await this.executeTask(mapperId, conn, { params });
  }

  async unassignUserReport(params: any, conn?: IvsConnection) {
    const mapperId = 'unassignUserReport';

    if (!conn) throw Error.noDbConnection(this.dbConfig.poolAlias, mapperId);
    return await this.executeTask(mapperId, conn, { params });
  }

  async moveUserReport(params: any, conn?: IvsConnection) {
    const mapperId = 'moveUserReport';

    if (!conn) throw Error.noDbConnection(this.dbConfig.poolAlias, mapperId);
    return await this.executeTask(mapperId, conn, { params });
  }

  async reassignUserReport(params: any, conn?: IvsConnection) {
    params.lan = 'E';
    const entities = <HaaAssignedUserReportEntity[]>params.entities;
    const recipientUserId = entities?.[0]?.recipientUserId;

    if (recipientUserId) {
      const assignedDao = new HaaAssignedUserReportDao({ context: this.context });
      const assignedReports = await assignedDao.paginateByFilters({ params, query: 'findByFilters' });
      const userMatch = assignedReports.rows.find(
        (row: HaaAssignedUserReportEntity) => recipientUserId === row.recipientUserId
      );
      if (userMatch) {
        throw ResponseDto.internalErrorCode(this.context, ErrorMapping.IVSHAA4418);
      }

      const unassignEntities = <HaaAssignedUserReportEntity[]>assignedReports.rows;
      if (unassignEntities.length < entities.length)
        throw ResponseDto.notFoundError(this.context, ErrorMapping.IVSHAA4404);
      await this.unassignUserReport({ entities: unassignEntities }, conn);

      const assignEntities = unassignEntities.map((entity) => {
        entity.recipientUserId = recipientUserId;
        return entity;
      });
      return await this.assignUserReport(
        {
          ...params,
          entities: assignEntities,
        },
        conn
      );
    }
  }
}
