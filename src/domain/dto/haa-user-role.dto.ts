import { BaseDto } from './haa-common.dto';

export default class HaaUserRoleDto extends BaseDto {
  roleId: string;
  roleDescription: string;
  roleName: string;
  cascadeInd: string;
}
