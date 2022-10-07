import { isNullOrUndefined } from '../../utils/util';
import ExchangeGetDto, { NpaExchangeGetDto } from '../dto/exchange-get.dto';
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

    static entityToDto(entities: ExchangeGetEntity[]): ExchangeGetDto[] {
        const dtos: ExchangeGetDto[] = [];
        let currDto: ExchangeGetDto | undefined = undefined;
        let currRn: number | undefined = undefined;

        entities.forEach((entity) => {
            const npaExchangeGetDto = new NpaExchangeGetDto();

            if (!isNullOrUndefined(entity.bnemNpaExchId) && !isNullOrUndefined(entity.bnemNpa)) {
                npaExchangeGetDto.bnemNpa = entity.bnemNpa;
                npaExchangeGetDto.bnemNpaExchId = entity.bnemNpaExchId;
            }

            if (!currDto || currRn !== entity.rn) {
                currRn = entity.rn;

                currDto = new ExchangeGetDto();
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
            currDto.npa.push(npaExchangeGetDto);
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
