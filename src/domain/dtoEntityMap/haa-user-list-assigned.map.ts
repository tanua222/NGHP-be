import HaaUserAssignedDto from '../dto/haa-user-assigned.dto';
import { SortParam } from '../dto/haa-common.dto';
import HaaUserAssignedEntity from '../entities/haa-user-assigned.entity';

export class HaaUserListAssignedMap {
  static dtoFieldToEntityFieldMapping: any = {
    userId: 'userId',
    userFirstName: 'userFirstName',
    userLastName: 'userLastName',
    userLogin: 'userLoginName',
    userEmail: 'userEmail',
    parentHierarchyNodeId: 'nodeId',
    parentHierarchyNodeName: 'nodeName',
    parentHierarchyNodeLevel: 'nodeLevel',
  };

  static entityToDto(entities: HaaUserAssignedEntity[]): HaaUserAssignedDto[] {
    const users = entities.map((entity) => {
      const user = new HaaUserAssignedDto();
      user.userId = entity.userId;
      user.userFirstName = entity.userFirstName;
      user.userLastName = entity.userLastName;
      user.userLogin = entity.userLoginName;
      user.userEmail = entity.userEmail;
      user.parentHierarchyNodeId = entity.nodeId;
      user.parentHierarchyNodeLevel = entity.nodeLevel;
      user.parentHierarchyNodeName = entity.nodeName;
      user.parentNodeType = entity.nodeType;
      user.canUnassignIndicator = entity.canUnassignIndicator;
      return user;
    });
    return users;
  }

  static mapDtoToEntitySortParams(sortParams: SortParam[]): SortParam[] {
    if (!sortParams.length) {
      sortParams = this.getDefaultSortParam();
    }
    const sortParamss: any[] = [];
    for (const sortParam of sortParams) {
      const entityField = this.dtoFieldToEntityFieldMapping[sortParam.fieldName];
      if (entityField) {
        sortParamss.push({ ...sortParam, fieldName: entityField });
      }
    }
    return sortParamss;
  }

  static getDefaultSortParam(): SortParam[] {
    return [
      {
        fieldName: 'userLastName',
        asc: true,
      },
      {
        fieldName: 'userFirstName',
        asc: true,
      },
    ];
  }
}
