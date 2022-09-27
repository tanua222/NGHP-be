import { RequestParam } from '../dto/haa-common.dto';
import HierarchyNodeDto, { HierarchyNodeRemoveDto } from '../dto/hierarchy-node.dto';
import CerptNodeEntity from '../entities/cerpt-node.entity';

export class HierarchyNodeMap {
  static entityToDtoMapping(entities: CerptNodeEntity[]): HierarchyNodeDto[] {
    const dto = new HierarchyNodeDto();
    const entity = entities[0];
    dto.nodeId = entity.id;
    dto.nodeName = entity.name;
    dto.description1 = entity.description1;
    dto.description2 = entity.description2;
    dto.description3 = entity.description3;
    dto.effectiveDate = entity.effectiveDate;

    return [dto];
  }

  static dtoToEntityForCreate(requestParam: RequestParam): CerptNodeEntity {
    const entity: CerptNodeEntity = new CerptNodeEntity();
    const dto: HierarchyNodeDto = requestParam.inputRequest;
    entity.name = dto.nodeName.trim();
    entity.description1 = dto.description1;
    entity.description2 = dto.description2;
    entity.description3 = dto.description3;
    return entity;
  }

  static dtoToEntityForUpdate(requestParam: RequestParam): CerptNodeEntity {
    const entity: CerptNodeEntity = new CerptNodeEntity();
    const dto: HierarchyNodeDto = requestParam.inputRequest;
    dto.nodeName && (entity.name = dto.nodeName.trim());
    if (dto.description1) {
      entity.description1 = dto.description1.trim();
    } else {
      entity.description1 = dto.description1;
    }
    if (dto.description2) {
      entity.description2 = dto.description2.trim();
    } else {
      entity.description2 = dto.description2;
    }
    if (dto.description3) {
      entity.description3 = dto.description3.trim();
    } else {
      entity.description3 = dto.description3;
    }
    return entity;
  }
}
