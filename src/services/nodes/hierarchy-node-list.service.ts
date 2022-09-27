import HierarchyNodeListDao from '../../dao/node/hierarchy-node-list.dao';
import { HierarchyNodeRequestParam, RequestParam, SortParam } from '../../domain/dto/haa-common.dto';
import HierarchyNodeListDto from '../../domain/dto/hierarchy-node-list.dto';
import { HierarchyNodeListMap } from '../../domain/dtoEntityMap/hierarchy-node-list.map';
import { HierarchyNodeQueryParams } from '../../domain/entities/haa-query-param.entity';
import HierarchyNodeEntity from '../../domain/entities/hierarchy-node.entity';
import Context from '../../utils/context';
import HaaBaseGetService from '../haa-base-get.service';
import HierarchyNodeValidatorService from '../validator/nodes/hierarchy-node-validation.service';

export default class HierarchyNodeListService extends HaaBaseGetService<HierarchyNodeListDao> {
  permissionDescriptions: string[];

  constructor(context: Context) {
    super({ context, dao: new HierarchyNodeListDao({ context }) });
    this.permissionDescriptions = ['VIEW-NODE'];
  }

  isPaginationRequired(requestParam?: RequestParam): boolean {
    return true;
  }

  mapEntityToDto(ivsEntity: HierarchyNodeEntity[]): HierarchyNodeListDto[] {
    return HierarchyNodeListMap.entityToDtoMapping(ivsEntity);
  }

  getDtoToEntitySortParams(sortParams: SortParam[]): SortParam[] {
    return HierarchyNodeListMap.mapDtoToEntitySortParams(sortParams);
  }

  mapToEntityQueryParams(requestParam: HierarchyNodeRequestParam): any {
    let haaEntityQueryParams: HierarchyNodeQueryParams = super.mapToEntityQueryParams(requestParam);
    requestParam.hierarchyNodeName &&
      (haaEntityQueryParams.hierarchyNodeName = requestParam.hierarchyNodeName.toLowerCase());
    requestParam.hierarchyNodeLevel &&
      (haaEntityQueryParams.hierarchyNodeLevel = Number(requestParam.hierarchyNodeLevel));
    requestParam.parentHierarchyNodeId &&
      (haaEntityQueryParams.parentHierarchyNodeId = requestParam.parentHierarchyNodeId);

    haaEntityQueryParams.loginUser = this.context.uuid;
    haaEntityQueryParams.permissionDescription = this.permissionDescriptions;
    return haaEntityQueryParams;
  }

  isArray(): boolean {
    return true;
  }

  async validateInput(queryParams: HierarchyNodeQueryParams): Promise<void> {
    const validationService: HierarchyNodeValidatorService = new HierarchyNodeValidatorService(this.dao);
    await validationService.validateInputForGetList(queryParams);
  }

  addLoginUserIdParam(): boolean {
    return true;
  }
}
