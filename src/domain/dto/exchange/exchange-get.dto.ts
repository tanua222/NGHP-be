import { BaseDto } from '../haa-common.dto';

export default class ExchangeGetDto extends BaseDto {
    abbreviation: string;
    bookNumber: string;
    createdTs?: string; 
    createdUserId: string;
    fullName: string;
    lastUpdatedTs?: string;
    lastUpdatedUserId: string;
    npa: NpaExchangeGetDto[];  
    secondAbbreviation: string; 
    sectionNumber: string;
}

export class NpaExchangeGetDto extends BaseDto {
    id: number;
    npa: string;
    }
