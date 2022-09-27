import { SortParam } from '../../../domain/dto/haa-common.dto';
import HaaAssignedIdCodeSetEntity from '../../../domain/entities/haa-assgined-id-code-set.entity';
import { BaseDaoOptions } from '../../base.dao';
import HaaBaseDao from '../../haa-base.dao';

export default class HaaAssignedIdCodeSetDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      mapperNamespace: 'haaAssignedIdCodeSetMapper',
      ...options,
    });
  }

  mapDbResultToEntity(results: any): HaaAssignedIdCodeSetEntity[] {
    return HaaAssignedIdCodeSetEntity.transform(results);
  }

  mapEntityParamsToDbColumns(sortParams: SortParam[]): string[] {
    const sortConditions = sortParams
      ?.filter((s1: any) => HaaAssignedIdCodeSetEntity.getDbColumnName(s1.fieldName))
      .map((s1: any) => {
        return { ...s1, fieldName: HaaAssignedIdCodeSetEntity.getDbColumnName(s1.fieldName) };
      });
    return sortConditions;
  }
}
