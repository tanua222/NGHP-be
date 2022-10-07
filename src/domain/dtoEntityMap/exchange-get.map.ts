import { isNullOrUndefined } from '../../utils/util';
import ExchangeDto, { NpaExchangeDto } from '../dto/exchange.dto';
import { SortParam } from '../dto/haa-common.dto';
import ExchangeGetEntity from '../entities/exchange-get.entity';

export class ExchangeMap {
    static dtoFieldToEntityFieldMapping: any = {
        rn: 'rn',
        abbrev: 'exchAbbrev',
        bookNum: 'bookNum',
        createdTs: 'createTs',
        createdUserId: 'createUserId',
        exchangeFullName: 'exchFullName',
        lastUpdatedTs: 'lastUpdtTs',
        lastUpdatedUserId: 'lastUpdtUserId',
        secondAbbrev: 'exchAbbrev2',
        sectionNum: 'sectionNum'
    };

    static entityToDto(entities: ExchangeGetEntity[]): ExchangeDto[] {
        const dtos: ExchangeDto[] = [];
        let currDto: ExchangeDto | undefined = undefined;
        let currRn: number | undefined = undefined;

        entities.forEach((entity) => {
            const npaExchangeDto = new NpaExchangeDto();

            if (!isNullOrUndefined(entity.bnemNpaExchId) && !isNullOrUndefined(entity.bnemNpa)) {
                npaExchangeDto.bnemNpa = entity.bnemNpa;
                npaExchangeDto.bnemNpaExchId = entity.bnemNpaExchId;
            }

            if (!currDto || currRn !== entity.rn) {
                currRn = entity.rn;

                currDto = new ExchangeDto();
                currDto.abbrev = entity.exchAbbrev;
                currDto.bookNum = entity.bookNum;
                currDto.createdTs = entity.createTs;
                currDto.createdUserId = entity.createUserId;
                currDto.exchangeFullName = entity.exchFullName;
                currDto.lastUpdatedTs = entity.lastUpdtTs;
                currDto.lastUpdatedUserId = entity.lastUpdtUserId;
                currDto.secondAbbrev = entity.exchAbbrev2;
                currDto.sectionNum = entity.sectionNum;
                currDto.npa = [];
                
                dtos.push(currDto);
            }
            currDto.npa.push(npaExchangeDto);
        });
        return dtos;
    }

    static mapDtoToEntitySortParams(sortParams: SortParam[]): SortParam[] {
        if (!sortParams.length) {
            sortParams = this.getDefaultSortParam();
        }
        const sortParamss: any[] = [];
        for (const sortParam of sortParams) {
            const entityField = this.dtoFieldToEntityFieldMapping[sortParam.fieldName];
            if (entityField) {
                sortParamss.push({ ...sortParam, fieldName: entityField });
            }
        }
        return sortParamss;
    }

    static getDefaultSortParam(): SortParam[] {
        return [
            {
                fieldName: 'exchangeFullName', // todo: what should be as a default?
                asc: false,
            },
        ];
    }

}
