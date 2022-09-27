import { SortParam } from '../../../domain/dto/haa-common.dto';
import { HaaAccountCodeSetEntity } from '../../../domain/entities/haa-account-code-set.entity';
import { BaseDaoOptions } from '../../base.dao';
import HaaBaseDao from '../../haa-base.dao';

export class HaaAccountCodeSetDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      mapperNamespace: 'haaAccountCodeSetMapper',
      ...options,
    });
  }

  mapDbResultToEntity(results: any): HaaAccountCodeSetEntity[] {
    return HaaAccountCodeSetEntity.transform(results);
  }

  mapEntityParamsToDbColumns(sortParams: SortParam[]): string[] {
    const sortConditions = sortParams
      ?.filter((s1: any) => HaaAccountCodeSetEntity.getDbColumnName(s1.fieldName))
      .map((s1: any) => {
        return { ...s1, fieldName: HaaAccountCodeSetEntity.getDbColumnName(s1.fieldName) };
      });
    return sortConditions;
  }
}
