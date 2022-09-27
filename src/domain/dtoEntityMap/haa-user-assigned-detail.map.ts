import { isNullOrUndefined } from '../../utils/util';
import HaaUserRoleDto from '../dto/haa-user-role.dto';
import HaaUserAssignedDetailDto from '../dto/haa-user-assigned-detail.dto';
import HaaUserAssignedDetailEntity from '../entities/haa-user-assigned-detail.entity';

export class HaaUserAssignedDetailMap {
  static entityToDto(entities: HaaUserAssignedDetailEntity[]): HaaUserAssignedDetailDto[] {
    if (!entities?.length) return [];

    const entity = entities[0];
    const user: HaaUserAssignedDetailDto = new HaaUserAssignedDetailDto();
    user.userFirstName = entity.firstName;
    user.userLastName = entity.lastName;
    user.userLogin = entity.login;
    user.userId = entity.uId;
    user.parentHierarchyNodeId = entity.hnId;

    user.role = [];
    for (const e of entities) {
      if (isNullOrUndefined(e.roleId) && isNullOrUndefined(e.roleCascading) && isNullOrUndefined(e.roleDescription)) {
        continue;
      }
      const role = new HaaUserRoleDto();
      role.roleId = e.roleId;
      role.cascadeInd = e.roleCascading;
      role.roleDescription = e.roleDescription;
      role.roleName = e.roleName
      user.role.push(role);
    }

    return [user];
  }
}
