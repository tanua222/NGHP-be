import HaaUserUnassignedDto from '../dto/haa-user-unassigned.dto';
import HaaUserUnassignedEntity from '../entities/haa-user-unassigned.entity';

export class HaaUserListUnassignedMap {
  static entityToDto(entities: HaaUserUnassignedEntity[]): HaaUserUnassignedDto[] {
    const users = entities.map((entity) => {
      const user = new HaaUserUnassignedDto();
      user.userId = entity.uId;
      user.userFirstName = entity.uFirstName;
      user.userLastName = entity.uLastName;
      user.userLogin = entity.uLoginName;
      return user;
    });
    return users;
  }
}
