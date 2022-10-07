import { BaseDto } from './haa-common.dto';

export default class ExchangeGetDto extends BaseDto {
    abbrev: string;
    bookNum: string;
    createdTs: string; 
    createdUserId: string;
    exchangeFullName: string;
    lastUpdatedTs: string;
    lastUpdatedUserId: string;
    npa: NpaExchangeGetDto[];  
    secondAbbrev: string; 
    sectionNum: string;
}

export class NpaExchangeGetDto extends BaseDto {
    bnemNpaExchId: number;
    bnemNpa: string;
    }
