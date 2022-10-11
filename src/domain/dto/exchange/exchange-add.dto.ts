import { BaseDto } from "../haa-common.dto";

export default class ExchangeAddDto extends BaseDto {
    abbreviation: string;
    bookNumber: string;
    createdUserId: string;
    fullName: string;
    lastUpdatedUserId: string;
    npa: NpaExchangeAddDto[];
    secondAbbreviation: string;
    sectionNumber: string;
}

export class NpaExchangeAddDto extends BaseDto {
    npa: string;

}
