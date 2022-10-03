import { BaseDto } from './haa-common.dto';

export default class ExchangeDto extends BaseDto {
     // todo datatypes
    abbrev: string;
    bookNum: string;
    createdTs: string; 
    createdUserId: string;
    exchangeFullName: string;
    lastUpdatedTs: string;
    lastUpdatedUserId: string;
    npa: NpaExchangeDto[];  
    secondAbbrev: string; 
    sectionNum: string;
}

export class NpaExchangeDto extends BaseDto {
    bnemNpaExchId: string;
    bnemNpa: string;
    }
