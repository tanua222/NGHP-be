import { BaseDto } from './haa-common.dto';
import HaaUserRoleDto from './haa-user-role.dto';

export default class HaaUserAssignedDetailDto extends BaseDto {
  userId: string;
  parentHierarchyNodeId: string;
  userFirstName: string;
  userLastName: string;
  userLogin: string;
  role: HaaUserRoleDto[];
}
