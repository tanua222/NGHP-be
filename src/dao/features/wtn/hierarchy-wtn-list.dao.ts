import { SortParam } from '../../../domain/dto/haa-common.dto';
import HierarchyWtnEntity from '../../../domain/entities/hierarchy-wtn.entity';
import { getSortByColumn } from '../../../utils/util';
import { BaseDaoOptions } from '../../base.dao';
import HaaBaseDao from '../../haa-base.dao';

export default class HierarchyWtnListDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({ mapperNamespace: 'hierarchyWtnListMapper', ...options });
  }

  mapDbResultToEntity(results: any): HierarchyWtnEntity[] {
    return HierarchyWtnEntity.transform(results);
  }

  mapEntityParamsToDbColumns(sortParams: SortParam[]): string[] {
    const obj = new HierarchyWtnEntity();

    return sortParams
      ?.filter((s1: any) => HierarchyWtnEntity.getDbColumnName(s1.fieldName))
      .map((s1: any) => {
        const sortBy = getSortByColumn(obj, s1.fieldName, HierarchyWtnEntity.getDbColumnName(s1.fieldName));
        return { ...s1, fieldName: sortBy };
      });
  }
}
