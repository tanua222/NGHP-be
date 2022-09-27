import { SortParam } from '../../../domain/dto/haa-common.dto';
import HaaIdCodeSetEntity from '../../../domain/entities/haa-id-code-set.entity';
import { getSortByColumn } from '../../../utils/util';
import { BaseDaoOptions } from '../../base.dao';
import HaaBaseDao from '../../haa-base.dao';

export class HaaIdCodeSetDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      mapperNamespace: 'haaIdCodeSetMapper',
      ...options,
    });
  }

  mapDbResultToEntity(results: any): HaaIdCodeSetEntity[] {
    return HaaIdCodeSetEntity.transform(results);
  }

  mapEntityParamsToDbColumns(sortParams: SortParam[]): string[] {
    const obj = new HaaIdCodeSetEntity();

    const sortConditions = sortParams
      ?.filter((s1: any) => HaaIdCodeSetEntity.getDbColumnName(s1.fieldName))
      .map((s1: any) => {
        const sortBy = getSortByColumn(obj, s1.fieldName, HaaIdCodeSetEntity.getDbColumnName(s1.fieldName));
        return { ...s1, fieldName: sortBy };
      });
    return sortConditions;
  }
}
