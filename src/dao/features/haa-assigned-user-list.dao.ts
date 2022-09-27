import { SortParam } from '../../domain/dto/haa-common.dto';
import HaaUserAssignedEntity from '../../domain/entities/haa-user-assigned.entity';
import { getSortByColumn } from '../../utils/util';
import { BaseDaoOptions } from '../base.dao';
import HaaBaseDao from '../haa-base.dao';

export default class HaaAssignedUserListDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      mapperNamespace: 'haaUserRoleSearchMapper',
      ...options,
    });
  }

  mapDbResultToEntity(results: any): HaaUserAssignedEntity[] {
    return HaaUserAssignedEntity.transform(results);
  }

  mapEntityParamsToDbColumns(sortParams: SortParam[]): string[] {
    const obj = new HaaUserAssignedEntity();

    const sortConditions = sortParams
      ?.filter((s1: any) => HaaUserAssignedEntity.getDbColumnName(s1.fieldName))
      .map((s1: any) => {
        const sortBy = getSortByColumn(obj, s1.fieldName, HaaUserAssignedEntity.getDbColumnName(s1.fieldName));
        // console.log(s1.fieldName, 'SORT:', sortBy);
        return { ...s1, fieldName: sortBy };
      });
    return sortConditions;
  }

  async findUsersByHnId(id: string): Promise<HaaUserAssignedEntity[]> {
    const params = {
      hnId: id,
    };

    const dbResults = await this.findByFilters({
      query: 'findUsersByHnId',
      params: params,
    });
    return HaaUserAssignedEntity.transform(dbResults);
  }
}
