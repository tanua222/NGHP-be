import { BaseDto } from './haa-common.dto';

export default class HaaAssignableTollfreeDto extends BaseDto {
  entitySequenceId: string;
  tollfreeNumber: string;
  tollfreeVanityNumber: string;
}
