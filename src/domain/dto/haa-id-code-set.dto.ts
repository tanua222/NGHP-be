import { BaseDto } from './haa-common.dto';

export class HaaAssignableIdCodeSetDto extends BaseDto {
  entitySequenceId: string;
  idCodeSetCode: string;
  idCodeSetDescription: string;
  idCodeSetType: string;
  idCodeSetLength: number;
  effectiveDate: string;
}
