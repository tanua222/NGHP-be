import { BaseDto } from './haa-common.dto';

export default class HaaExtractDto extends BaseDto {
  extractId: string;
  hierarchyNodeName: string;
  updateDate: string;
  status: string;
  extractFileName: string;
  message: string | null;
}
