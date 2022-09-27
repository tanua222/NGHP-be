import { SortParam } from '../../../domain/dto/haa-common.dto';
import HaaExtractEntity from '../../../domain/entities/haa-extract.entity';
import { BaseDaoOptions } from '../../base.dao';
import HaaBaseDao from '../../haa-base.dao';

export default class HaaExtractsListDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      mapperNamespace: 'haaExtractsMapper',
      ...options,
    });
  }

  mapDbResultToEntity(results: any): HaaExtractEntity[] {
    return HaaExtractEntity.transform(results);
  }

  mapEntityParamsToDbColumns(sortParams: SortParam[]): string[] {
    const sortConditions = sortParams
      ?.filter((s1: any) => HaaExtractEntity.getDbColumnName(s1.fieldName))
      .map((s1: any) => {
        let fieldName = HaaExtractEntity.getDbColumnName(s1.fieldName);
        s1.fieldName !== 'updateDate' && (fieldName = `LOWER(${fieldName})`);

        return { ...s1, fieldName };
      });
    return sortConditions;
  }
}
