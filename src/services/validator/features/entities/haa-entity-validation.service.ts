import HaaBaseDao from '../../../../dao/haa-base.dao';
import Error from '../../../../domain/dto/error.dto';
import ResponseDto from '../../../../domain/dto/response.dto';
import HaaQueryParams, { HaaAssignableTollfreeQueryParam } from '../../../../domain/entities/haa-query-param.entity';
import { HaaAssignedTollfreeQueryParam } from '../../../../domain/entities/haa-query-param.entity';
import { errorResponse } from '../../../../error/error-responses';
import { ErrorMapping } from '../../../../error/error-responses-mapping';
import HaaValidationBaseService from '../../haa-validation-base.service';
import HierarchyNodeDao from '../../../../dao/node/hierarchy-node.dao';
import HaaEntityDao from '../../../../dao/features/entities/haa-entity.dao';

export default class HaaEntityValidatorService extends HaaValidationBaseService {
  hierarchyNodeDao: HierarchyNodeDao;
  haaEntityDao: HaaEntityDao;

  constructor(dao: HaaBaseDao) {
    super(dao);
    this.hierarchyNodeDao = new HierarchyNodeDao({ context: this.context });
    this.haaEntityDao = new HaaEntityDao({ context: this.context });
  }

  async validateInputForAssign(queryParams: HaaQueryParams): Promise<any> {
    const errors: Error[] = [];
    const ivshaa4405: string[] = [];
    const notFound: string[] = [];

    if (queryParams.entities.length > 0) {
      for await (const [i, e] of queryParams.entities.entries()) {
        const missingFields = [];

        if (!e.hierarchyNodeId) missingFields.push('parentHierarchyNodeId');
        else {
          const res = await this.hierarchyNodeDao.findHierarchyNodeByParams({
            hierarchyNodeId: e.hierarchyNodeId,
          });
          if (res.length === 0) notFound.push(e.hierarchyNodeId);
        }

        if (!e.entitySequenceId) missingFields.push('entitySequenceId');
        else {
          const res = await (<HaaEntityDao>this.dao).findBySeqId({
            entitySequenceId: e.entitySequenceId,
            entityType: e.entityType,
          });
          if (res.length === 0) notFound.push(e.entitySequenceId);
        }

        if (missingFields.length) {
          const obj: any = {};
          obj[i] = missingFields;
          ivshaa4405.push(obj);
        }
      }

      if (notFound.length > 0) {
        throw ResponseDto.notFoundError(this.context, notFound);
      }
      if (ivshaa4405.length > 0) {
        errors.push(errorResponse(ErrorMapping.IVSHAA4405, this.context, ivshaa4405));
      }
    }
    this.returnValidationErrors(errors);
  }

  async validateInputForUnassign(queryParams: HaaQueryParams): Promise<any> {
    const errors: Error[] = [];
    const ivshaa4405: string[] = [];
    const notFound: string[] = [];

    if (queryParams.entities.length > 0) {
      for await (const [i, e] of queryParams.entities.entries()) {
        if (!e.entityNodeId) {
          const obj: any = {};
          obj[i] = ['entityNodeId'];
          ivshaa4405.push(obj);
        } else {
          const res = await this.haaEntityDao.findHierarchyNodeByParams({
            entityNodeIdList: [e.entityNodeId],
          });
          res;
          if (res.length === 0) notFound.push(e.entityNodeId);
        }
      }

      if (notFound.length > 0) {
        throw ResponseDto.notFoundError(this.context, notFound);
      }
      if (ivshaa4405.length > 0) {
        errors.push(errorResponse(ErrorMapping.IVSHAA4405, this.context, ivshaa4405));
      }
    }
    this.returnValidationErrors(errors);
  }
}
