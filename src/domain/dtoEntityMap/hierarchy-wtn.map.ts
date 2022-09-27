import { HierarchyNodeRequestParam } from '../dto/haa-common.dto';
import HierarchyWtnDto from '../dto/hierarchy-wtn.dto';
import HierarchyWtnEntity from '../entities/hierarchy-wtn.entity';

export class HierarchyWtnMap {
  static entityToDtoMapping(entities: HierarchyWtnEntity[]): HierarchyWtnDto[] {
    const dto = new HierarchyWtnDto();
    const entity = entities[0];
    dto.hierarchyNodeId = entity.id;
    dto.description1 = entity.description1;
    dto.description2 = entity.description2;
    dto.description3 = entity.description3;
    dto.workingTelephoneNumber = entity.wtn;
    dto.excludeFromReportCode = entity.excludeFromReportsFlag;
    dto.billingTelephoneNumber = entity.btn;
    dto.parentHierarchyNodeId = entity.parentHierarchyId;
    dto.wtnNodeId = entity.nodeId;

    return [dto];
  }

  static dtoToEntityForCreate(requestParam: HierarchyNodeRequestParam): HierarchyWtnEntity {
    const entity: HierarchyWtnEntity = new HierarchyWtnEntity();
    const dto: HierarchyWtnDto = requestParam.inputRequest;
    entity.parentHierarchyId = dto.parentHierarchyNodeId;
    entity.name = dto.workingTelephoneNumber;
    entity.wtn = dto.workingTelephoneNumber;
    entity.wtnType = 'RTN';
    entity.excludeFromReportsFlag = dto.excludeFromReportCode;
    entity.description1 = dto.description1;
    entity.description2 = dto.description2;
    entity.description3 = dto.description3;
    return entity;
  }

  static dtoToEntityForUpdate(requestParam: HierarchyNodeRequestParam): HierarchyWtnEntity {
    const entity = new HierarchyWtnEntity();
    const dto: HierarchyWtnDto = requestParam.inputRequest;
    dto.excludeFromReportCode && (entity.excludeFromReportsFlag = dto.excludeFromReportCode);
    entity.description1 = dto.description1;
    entity.description2 = dto.description2;
    entity.description3 = dto.description3;
    return entity;
  }
}
