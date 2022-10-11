import { isNullOrUndefined } from '../../../utils/util';
import ExchangeGetDto, { NpaExchangeGetDto } from '../../dto/exchange/exchange-get.dto';
import { SortParam } from '../../dto/haa-common.dto';
import ExchangeGetEntity from '../../entities/exchange/exchange-get.entity';

export class ExchangeMap {
    static dtoFieldToEntityFieldMapping: any = {
        rn: 'rn',
        abbreviation: 'exchAbbrev',
        bookNumber: 'bookNumber',
        createdTs: 'createTs',
        createdUserId: 'createUserId',
        fullName: 'exchFullName',
        lastUpdatedTs: 'lastUpdtTs',
        lastUpdatedUserId: 'lastUpdtUserId',
        secondAbbreviation: 'exchAbbrev2',
        sectionNumber: 'sectionNumber'
    };

    static entityToDto(entities: ExchangeGetEntity[]): ExchangeGetDto[] {
        const dtos: ExchangeGetDto[] = [];
        let currDto: ExchangeGetDto | undefined = undefined;
        let currRn: number | undefined = undefined;

        entities.forEach((entity) => {
            const npaExchangeGetDto = new NpaExchangeGetDto();

            if (!isNullOrUndefined(entity.id) && !isNullOrUndefined(entity.npa)) {
                npaExchangeGetDto.npa = entity.npa;
                npaExchangeGetDto.id = entity.id;
            }

            if (!currDto || currRn !== entity.rn) {
                currRn = entity.rn;

                currDto = new ExchangeGetDto();
                currDto.abbreviation = entity.exchAbbrev;
                currDto.bookNumber = entity.bookNumber;
                currDto.createdTs = entity.createTs;
                currDto.createdUserId = entity.createUserId;
                currDto.fullName = entity.exchFullName;
                currDto.lastUpdatedTs = entity.lastUpdtTs;
                currDto.lastUpdatedUserId = entity.lastUpdtUserId;
                currDto.secondAbbreviation = entity.exchAbbrev2;
                currDto.sectionNumber = entity.sectionNumber;
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
                fieldName: 'fullName', // todo: what should be as a default?
                asc: false,
            },
        ];
    }

}
