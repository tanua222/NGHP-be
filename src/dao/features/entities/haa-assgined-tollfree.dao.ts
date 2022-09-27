import { SortParam } from '../../../domain/dto/haa-common.dto';
import HaaAssignedTollfreeEntity from '../../../domain/entities/haa-assgined-tollfree.entity';
import { BaseDaoOptions } from '../../base.dao';
import HaaBaseDao from '../../haa-base.dao';

export default class HaaAssignedTollfreeDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      mapperNamespace: 'haaAssignedTollfreeMapper',
      ...options,
    });
  }

  mapDbResultToEntity(results: any): HaaAssignedTollfreeEntity[] {
    return HaaAssignedTollfreeEntity.transform(results);
  }

  mapEntityParamsToDbColumns(sortParams: SortParam[]): string[] {
    const sortConditions = sortParams
      ?.filter((s1: any) => HaaAssignedTollfreeEntity.getDbColumnName(s1.fieldName))
      .map((s1: any) => {
        return { ...s1, fieldName: HaaAssignedTollfreeEntity.getDbColumnName(s1.fieldName) };
      });
    return sortConditions;
  }
}
