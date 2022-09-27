import { HierarchyTreeQueryParams } from '../domain/entities/haa-query-param.entity';
import HierarchyTreeNodeEntity from '../domain/entities/hierarchy-tree.entity';
import HierarchyUserPrivilegeEntity from '../domain/entities/hierarchy-user-privileges.entity';
import { BaseDaoOptions } from './base.dao';
import HaaBaseDao from './haa-base.dao';

export default class HierarchyTreeDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({ mapperNamespace: 'hierarchyTreeMapper', ...options });
  }

  async getTreeWithMoveIndicator(queryParam: HierarchyTreeQueryParams, loginUserId: string) {
    const params = {
      corpId: queryParam.corporationId,
      loginUserId,
    };

    let dbResult = await this.findByFilters({ query: 'getTreeByCorpIdWithMoveIndicator', params });
    return HierarchyTreeNodeEntity.transform(dbResult);
  }

  async getTreeByCorpId(queryParam: HierarchyTreeQueryParams) {
    const params = {
      corpId: queryParam.corporationId,
      includeWTN: queryParam.includeWTN,
      loginUser: this.context.uuid,
    };

    let dbResult = await this.findByFilters({ query: 'getTreeByCorpId', params });
    return HierarchyTreeNodeEntity.transform(dbResult);
  }

  async getUserCanViewPrivileges(queryParam: HierarchyTreeQueryParams) {
    const params = {
      loginUserId: queryParam.loginUser,
    };

    let dbResult = await this.findByFilters({ query: 'getCanViewPrivileges', params });
    return HierarchyUserPrivilegeEntity.transform(dbResult);
  }
}
