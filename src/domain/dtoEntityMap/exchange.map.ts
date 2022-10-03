import { isNullOrUndefined } from '../../utils/util';
import ExchangeDto, { NpaExchangeDto } from '../dto/exchange.dto';
import { SortParam } from '../dto/haa-common.dto';
import ExchangeEntity from '../entities/exchange.entity';

export class ExchangeMap {
    // todo 
    static dtoFieldToEntityFieldMapping: any = {
        exchangeFullName: 'exchangeFullName'
    };

    static entityToDto(entities: ExchangeEntity[]): ExchangeDto[] {
        const dtos = entities.map((entity) => {
            const dto: ExchangeDto = new ExchangeDto();
            // todo create dto structure
            dto.abbrev = entity.exchAbbrev;
            dto.bookNum = entity.bookNum;
            dto.createdTs = entity.createTs;
            dto.createdUserId = entity.createUserId;
            dto.exchangeFullName = entity.exchFullName;
            dto.lastUpdatedTs = entity.lastUpdtTs;
            dto.lastUpdatedUserId = entity.lastUpdtUserId;
            dto.secondAbbrev = entity.exchAbbrev2;
            dto.sectionNum = entity.sectionNum;

            // dto.npa = [];
            // for (const e of entities) {
            //     if (isNullOrUndefined(e.bnemNpaExchId) && isNullOrUndefined(e.bnemNpa)) {
            //         continue;
            //     }
            //     const npaExchangeDto = new NpaExchangeDto();
            //     npaExchangeDto.bnemNpa = e.bnemNpa;
            //     npaExchangeDto.bnemNpaExchId = e.bnemNpaExchId;
            //     dto.npa.push(npaExchangeDto);
            // }

            return dto;
        });

        // todo 1: pack to map
        // todo 2: convert to dtos
        
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
                fieldName: 'abbrev', // todo: what should be as a default?
                asc: false,
            },
        ];
    }

}
