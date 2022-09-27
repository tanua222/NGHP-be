import { SortParam } from '../../domain/dto/haa-common.dto';
import HierarchyNodeEntity from '../../domain/entities/hierarchy-node.entity';
import { getSortByColumn } from '../../utils/util';
import { BaseDaoOptions } from '../base.dao';
import HaaBaseDao from '../haa-base.dao';

export default class HierarchyNodeListDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({ mapperNamespace: 'hierarchyNodeListMapper', ...options });
  }

  mapDbResultToEntity(results: any): HierarchyNodeEntity[] {
    return HierarchyNodeEntity.transform(results);
  }

  mapEntityParamsToDbColumns(sortParams: SortParam[]): string[] {
    const obj = new HierarchyNodeEntity();

    return sortParams
      ?.filter((s1: any) => HierarchyNodeEntity.getDbColumnName(s1.fieldName))
      .map((s1: any) => {
        const sortBy = getSortByColumn(obj, s1.fieldName, HierarchyNodeEntity.getDbColumnName(s1.fieldName));
        return { ...s1, fieldName: sortBy };
      });
  }
}
