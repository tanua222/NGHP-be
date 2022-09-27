import { SortParam } from '../../../domain/dto/haa-common.dto';
import HaaAssignedUserReportEntity from '../../../domain/entities/haa-assigned-user-report.entity';
import { BaseDaoOptions } from '../../base.dao';
import HaaBaseDao from '../../haa-base.dao';

export default class HaaAssignedUserReportDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      mapperNamespace: 'haaAssignedUserReportMapper',
      ...options,
    });
  }

  mapDbResultToEntity(results: any): HaaAssignedUserReportEntity[] {
    return HaaAssignedUserReportEntity.transform(results);
  }

  mapEntityParamsToDbColumns(sortParams: SortParam[]): string[] {
    const sortConditions = sortParams
      ?.filter((s1: any) => HaaAssignedUserReportEntity.getDbColumnName(s1.fieldName))
      .map((s1: any) => {
        return { ...s1, fieldName: `LOWER(${HaaAssignedUserReportEntity.getDbColumnName(s1.fieldName)})` };
      });
    return sortConditions;
  }

  async findHierarchyNodeByParams(args: any): Promise<HaaAssignedUserReportEntity[]> {
    const param = {
      ...args,
    };

    const dbResult = await this.findByFilters({
      query: 'findByAssignedReportIdList',
      params: param,
      mapperNamespace: 'haaAssignedUserReportMapper',
    });

    return HaaAssignedUserReportEntity.transform(dbResult);
  }
}
