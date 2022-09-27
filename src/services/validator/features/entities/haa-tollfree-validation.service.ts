import HaaBaseDao from '../../../../dao/haa-base.dao';
import Error from '../../../../domain/dto/error.dto';
import { HaaAssignableTollfreeQueryParam } from '../../../../domain/entities/haa-query-param.entity';
import { HaaAssignedTollfreeQueryParam } from '../../../../domain/entities/haa-query-param.entity';
import { errorResponse } from '../../../../error/error-responses';
import { ErrorMapping } from '../../../../error/error-responses-mapping';
import HaaValidationBaseService from '../../haa-validation-base.service';
import HierarchyNodeDao from '../../../../dao/node/hierarchy-node.dao';
import HaaEntityDao from '../../../../dao/features/entities/haa-entity.dao';

export default class HaaTollfreeValidatorService extends HaaValidationBaseService {
  hierarchyNodeDao: HierarchyNodeDao;
  haaEntityDao: HaaEntityDao;

  constructor(dao: HaaBaseDao) {
    super(dao);
    this.hierarchyNodeDao = new HierarchyNodeDao({ context: this.context });
    this.haaEntityDao = new HaaEntityDao({ context: this.context });
  }

  validateInputForGetAssignable(queryParams: HaaAssignableTollfreeQueryParam): any {
    const errors: Error[] = [];
    if (!queryParams.parentHnId) {
      errors.push(errorResponse(ErrorMapping.IVSHAA4405, this.context, ['parentHierarchyNodeId']));
    }
    this.returnValidationErrors(errors);
  }

  validateInputForGetAssigned(queryParams: HaaAssignedTollfreeQueryParam): any {
    const errors: Error[] = [];
    if (!queryParams.parentHierarchyNodeId && !queryParams.corporationId) {
      errors.push(
        errorResponse(ErrorMapping.IVSHAA4405, this.context, {
          missingFields: 'corporationId or parentHierarchyNodeId',
        })
      );
    }
    this.returnValidationErrors(errors);
  }
}
