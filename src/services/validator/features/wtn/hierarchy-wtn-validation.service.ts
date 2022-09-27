import ResponseDto, { Error } from '../../../../domain/dto/response.dto';
import CerptNodeEntity from '../../../../domain/entities/cerpt-node.entity';
import { HierarchyNodeQueryParams } from '../../../../domain/entities/haa-query-param.entity';
import HierarchyNodeEntity from '../../../../domain/entities/hierarchy-node.entity';
import { errorResponse } from '../../../../error/error-responses';
import { ErrorMapping } from '../../../../error/error-responses-mapping';
import HierarchyNodeValidatorService from '../../nodes/hierarchy-node-validation.service';

export default class HierarchyWtnValidatorService extends HierarchyNodeValidatorService {
  async validateInputForUpdate(queryParams: HierarchyNodeQueryParams): Promise<any> {
    const errors: Error[] = [];
    const hierarchyNodeEntity = (
      await this.hierarchyNodeGetService.findNodeByParams({ nodeId: queryParams.nodeId })
    )[0];
    if (!hierarchyNodeEntity) {
      throw ResponseDto.notFoundError(this.context, { nodeId: queryParams.nodeId });
    }
    this.returnValidationErrors(errors);
  }

  async validateNode(queryParams: HierarchyNodeQueryParams, corpId: string, errors: Error[], nodeId?: string) {
    const entityToCreate = <CerptNodeEntity>queryParams.entities[0];
    const wtnEntity = await this.hierarchyNodeGetService.findNodeByParams({
      wtn: entityToCreate.wtn,
      corpId: corpId,
      ownNodeId: nodeId,
    });
    if (wtnEntity.length > 0) {
      errors.push(errorResponse(ErrorMapping.IVSHAA4422, this.context, { wtn: entityToCreate.wtn }));
    }
  }

  async validateParentNode(parentHierarchyNodeEntity: HierarchyNodeEntity, errors: Error[]) {
    return;
  }
}
