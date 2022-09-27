import BaseDao from '../../../dao/base.dao';
import HaaBaseDao from '../../../dao/haa-base.dao';
import HierarchyNodeDao from '../../../dao/node/hierarchy-node.dao';
import ResponseDto, { Error } from '../../../domain/dto/response.dto';
import CerptNodeEntity from '../../../domain/entities/cerpt-node.entity';
import HaaQueryParams from '../../../domain/entities/haa-query-param.entity';
import haaQueryParamEntity, { HierarchyNodeQueryParams } from '../../../domain/entities/haa-query-param.entity';
import HierarchyNodeEntity from '../../../domain/entities/hierarchy-node.entity';
import { errorResponse } from '../../../error/error-responses';
import { ErrorMapping } from '../../../error/error-responses-mapping';
import { BASE_CORP_NODE_LEVEL, MAXIMUM_ALLOWABLE_NODE_LEVEL, NODE_TYPES } from '../../../utils/constants';
import HaaUserListAssignedService from '../../features/users/haa-user-list-assigned.service';
import HierarchyNodeGetService from '../../nodes/hierarchy-node-get.service';
import HaaValidationService from '../haa-validation.service';

export default class HierarchyNodeValidatorService extends HaaValidationService {
  hierarchyNodeGetService: HierarchyNodeGetService;

  constructor(dao: HaaBaseDao) {
    super(dao);
    this.hierarchyNodeGetService = new HierarchyNodeGetService(this.context);
  }

  async validateInputForCreate(queryParams: HierarchyNodeQueryParams): Promise<any> {
    const errors: Error[] = [];
    const hierarchyNodeEntity = (
      await this.hierarchyNodeGetService.findHierarchyNodeByParams({
        hierarchyNodeId: queryParams.parentHierarchyNodeId,
      })
    )[0];
    if (hierarchyNodeEntity) {
      const corpId = hierarchyNodeEntity.corpId;
      await this.validateParentNode(hierarchyNodeEntity, errors);
      await this.validateNode(queryParams, corpId, errors);
      if (hierarchyNodeEntity.ntpId + 1 > MAXIMUM_ALLOWABLE_NODE_LEVEL + BASE_CORP_NODE_LEVEL) {
        errors.push(
          errorResponse(ErrorMapping.IVSHAA4421, this.context, {
            parentHierarchyNodeId: queryParams.parentHierarchyNodeId,
          })
        );
      }
    } else {
      throw ResponseDto.notFoundError(this.context, { parentHierarchyNodeId: queryParams.parentHierarchyNodeId });
    }

    this.returnValidationErrors(errors);
  }

  async validateInputForUpdate(queryParams: HierarchyNodeQueryParams): Promise<any> {
    const errors: Error[] = [];
    const hierarchyNodeEntity = (
      await this.hierarchyNodeGetService.findNodeByParams({ nodeId: queryParams.nodeId })
    )[0];
    if (hierarchyNodeEntity) {
      const corpId = hierarchyNodeEntity.corpId;
      const nodeId = hierarchyNodeEntity.id;
      await this.validateNode(queryParams, corpId, errors, nodeId);
    } else {
      throw ResponseDto.notFoundError(this.context, { nodeId: queryParams.nodeId });
    }
    this.returnValidationErrors(errors);
  }

  async validateInputForDelete(queryParams: HierarchyNodeQueryParams): Promise<any> {
    const errors: Error[] = [];
    const nodeEntity = (await this.hierarchyNodeGetService.findNodeByParams({ nodeId: queryParams.nodeId }))[0];
    const hierarchyNodeEntity = (
      await this.hierarchyNodeGetService.findHierarchyNodeByParams({ nodeId: queryParams.nodeId })
    )[0];
    if (!nodeEntity || !hierarchyNodeEntity) {
      throw ResponseDto.notFoundError(this.context, { nodeId: queryParams.nodeId });
    }

    const childEntities = await this.hierarchyNodeGetService.findHierarchyNodeByParams({
      parentHierarchyNodeId: hierarchyNodeEntity.id,
    });
    if (childEntities.length > 0) {
      errors.push(errorResponse(ErrorMapping.IVSHAA4426, this.context, {}));
    }

    const userService = new HaaUserListAssignedService(this.context);
    const attachedUsers = await userService.findUsersByHnId(hierarchyNodeEntity.id);
    if (attachedUsers.length > 0) {
      errors.push(errorResponse(ErrorMapping.IVSHAA4427, this.context, {}));
    }

    this.returnValidationErrors(errors);
  }

  async validateNode(queryParams: HierarchyNodeQueryParams, corpId: string, errors: Error[], nodeId?: string) {
    const entityToCreate = <CerptNodeEntity>queryParams.entities[0];
    if (
      (
        await this.hierarchyNodeGetService.findNodeByParams({
          nodeName: entityToCreate.name,
          corpId: corpId,
          ownNodeId: nodeId,
        })
      ).length > 0
    ) {
      errors.push(errorResponse(ErrorMapping.IVSHAA4420, this.context, { nodeName: entityToCreate.name }));
    }
  }

  async validateInputForGet(queryParams: HierarchyNodeQueryParams): Promise<void> {
    const errors: Error[] = [];
    const nodeId = queryParams.nodeId;
    const validNodeEntity = await this.hierarchyNodeGetService.findNodeByParams({ nodeId: nodeId });
    if (!validNodeEntity) {
      throw ResponseDto.notFoundError(this.context, { nodeId: queryParams.nodeId });
    }
    this.returnValidationErrors(errors);
  }

  async validateInputForGetList(queryParams: HierarchyNodeQueryParams): Promise<void> {
    const errors: Error[] = [];
    if (!queryParams.corporationId && !queryParams.parentHierarchyNodeId) {
      errors.push(
        errorResponse(ErrorMapping.IVSHAA4405, this.context, {
          missingFields: 'corporationId or parentHierarchyNodeId',
        })
      );
    }
    this.returnValidationErrors(errors);
  }

  async validateInputForMove(queryParams: HaaQueryParams) {
    const errors: Error[] = [];
    const entities = <HierarchyNodeEntity[]>queryParams.entities;

    if (entities.length === 0) {
      errors.push(errorResponse(ErrorMapping.IVSHAA4405, this.context, ['nodeId']));
    } else {
      const hierarchyNodeId = entities[0].parentHierarchyId;

      if (hierarchyNodeId) {
        const res = await this.hierarchyNodeGetService.findHierarchyNodeByParams({ hierarchyNodeId });
        const node = res?.[0];
        if (!node) {
          throw ResponseDto.notFoundError(this.context, { targetParentHierarchyNodeId: hierarchyNodeId });
        }
        if (node && node.nodeType === NODE_TYPES.DEFAULT_NODE) {
          errors.push(
            errorResponse(ErrorMapping.IVSHAA4431, this.context, {
              targetParentHierarchyNodeId: hierarchyNodeId,
            })
          );
        }
      } else {
        errors.push(errorResponse(ErrorMapping.IVSHAA4405, this.context, ['targetParentHierarchyNodeId']));
      }
    }

    this.returnValidationErrors(errors);
  }

  async validateParentNode(parentHierarchyNodeEntity: HierarchyNodeEntity, errors: Error[]) {
    if (parentHierarchyNodeEntity.nodeType == NODE_TYPES.DEFAULT_NODE) {
      errors.push(
        errorResponse(ErrorMapping.IVSHAA4433, this.context, {
          parentHierarchyNodeType: parentHierarchyNodeEntity.nodeType,
        })
      );
    }
  }
}
