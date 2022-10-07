import { BaseDto } from './haa-common.dto';

export default class ExchangeDto extends BaseDto {
    abbrev: string;
    bookNum: string;
    createdUserId: string;
    exchangeFullName: string;
    lastUpdatedUserId: string;
    npa: NpaExchangePostDto[];
    secondAbbrev: string;
    sectionNum: string;
}

export class NpaExchangePostDto extends BaseDto {
    bnemNpa: string;
}
