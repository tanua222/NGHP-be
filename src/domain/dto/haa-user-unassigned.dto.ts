import { BaseDto } from './haa-common.dto';

export default class HaaUserUnassignedDto extends BaseDto {
  userId: string;
  userFirstName: string;
  userLastName: string;
  userLogin: string;
}
