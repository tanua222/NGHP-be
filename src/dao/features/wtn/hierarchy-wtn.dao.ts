import { maxRows } from 'oracledb';
import ResponseDto from '../../../domain/dto/response.dto';
import { HierarchyNodeQueryParams } from '../../../domain/entities/haa-query-param.entity';
import HierarchyWtnEntity from '../../../domain/entities/hierarchy-wtn.entity';
import { ErrorMapping } from '../../../error/error-responses-mapping';
import { IvsConnection } from '../../../utils/database';
import { BaseDaoOptions } from '../../base.dao';
import HaaBaseDao from '../../haa-base.dao';
import HierarchyNodeDao from '../../node/hierarchy-node.dao';

export default class HierarchyWtnDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({ mapperNamespace: 'hierarchyWtnMapper', ...options });
  }

  mapDbResultToEntity(results: any): HierarchyWtnEntity[] {
    return HierarchyWtnEntity.transform(results);
  }

  async createDbEntitiesByParams(queryParam: HierarchyNodeQueryParams, conn: IvsConnection) {
    const hierarchyNodeDao = new HierarchyNodeDao({ context: this.context });
    return hierarchyNodeDao.createDbEntitiesByParams(queryParam, conn);
  }

  async deleteDbEntitiesByParams(queryParam: HierarchyNodeQueryParams, conn: IvsConnection) {
    const hierarchyNodeDao = new HierarchyNodeDao({ context: this.context });
    return hierarchyNodeDao.deleteDbEntitiesByParams(queryParam, conn);
  }

  async moveWtn(params: any, connection?: IvsConnection) {
    const entities = <HierarchyWtnEntity[]>params.entities;
    const targetParentHierarchyId = entities?.[0]?.parentHierarchyId;
    let rowsAffected = 0;

    if (targetParentHierarchyId) {
      const hierarchyNodeMapperNamespace = 'hierarchyNodeMapper';

      for (const entity of entities) {
        params.nodeId = entity.nodeId;
        let wtnResult = await this.paginateByFilters({ params, query: 'findByFilters' });

        if (wtnResult?.rows.length > 0) {
          const wtn: HierarchyWtnEntity = wtnResult?.rows[0] || {};

          if (targetParentHierarchyId === wtn.parentHierarchyId) {
            throw ResponseDto.internalErrorCode(this.context, ErrorMapping.IVSHAA4430);
          }
          await this.delete({
            mapperNamespace: hierarchyNodeMapperNamespace,
            connection,
            params,
          });

          wtn.parentHierarchyId = targetParentHierarchyId;
          params = {
            ...params,
            ...wtn,
          };

          const res = await this.add({
            connection,
            params,
          });

          rowsAffected += res.rowsAffected;
        }
      }

      if (rowsAffected) {
        return { rowsAffected };
      }
    }
  }
}
