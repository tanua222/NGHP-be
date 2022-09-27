import { SortParam } from '../../../domain/dto/haa-common.dto';
import HaaAssignableTollfreeEntity from '../../../domain/entities/haa-assignable-tollfree.entity';
import { BaseDaoOptions } from '../../base.dao';
import HaaBaseDao from '../../haa-base.dao';

export default class HaaAssignableTollfreeDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      mapperNamespace: 'haaAssignableTollfreeMapper',
      ...options,
    });
  }

  mapDbResultToEntity(results: any): HaaAssignableTollfreeEntity[] {
    return HaaAssignableTollfreeEntity.transform(results);
  }

  mapEntityParamsToDbColumns(sortParams: SortParam[]): string[] {
    const sortConditions = sortParams
      ?.filter((s1: any) => HaaAssignableTollfreeEntity.getDbColumnName(s1.fieldName))
      .map((s1: any) => {
        return { ...s1, fieldName: HaaAssignableTollfreeEntity.getDbColumnName(s1.fieldName) };
      });
    return sortConditions;
  }
}
