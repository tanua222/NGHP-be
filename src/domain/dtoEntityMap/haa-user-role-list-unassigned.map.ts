import HaaUserRoleDto from '../dto/haa-user-role.dto';
import HaaUserRoleUnassignedEntity from '../entities/haa-user-role-unassigned.entity';

export class HaaUserRoleListUnassignedMap {
  static entityToDto(entities: HaaUserRoleUnassignedEntity[]): HaaUserRoleDto[] {
    const users = entities.map((entity) => {
      const user = new HaaUserRoleDto();
      user.roleId = entity.assignableRoleId;
      user.roleDescription = entity.description;
      user.roleName = entity.name;
      user.cascadeInd = entity.cascading;
      return user;
    });
    return users;
  }
}
