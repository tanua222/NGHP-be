import { BaseDto } from "../haa-common.dto";

export default class ExchangeUpdateDto extends BaseDto {
    abbreviation: string;
    bookNumber: string;
    createdUserId: string;
    fullName: string;
    lastUpdatedUserId: string;
    npa: NpaExchangeUpdateDto[];
    secondAbbreviation: string;
    sectionNumber: string;
}

export class NpaExchangeUpdateDto extends BaseDto {
    id: number;
    npa: string;
}
