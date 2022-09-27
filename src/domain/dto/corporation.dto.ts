import { BaseDto } from './haa-common.dto';

export default class CorporationDto extends BaseDto {
  cosAddress1: string;
  cosAddress2: string;
  cosAddress3: string;
  cosCity: string;
  cosPostalZip: string;
  psnId: number;
  cosName: string;
}
