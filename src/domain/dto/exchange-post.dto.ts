import { BaseDto } from './haa-common.dto';

export default class ExchangeDto extends BaseDto {
    abbreviation: string;
    bookNumber: string;
    createdUserId: string;
    fullName: string;
    lastUpdatedUserId: string;
    npa: NpaExchangePostDto[];
    secondAbbreviation: string;
    sectionNumber: string;
}

export class NpaExchangePostDto extends BaseDto {
    npa: string;
}
