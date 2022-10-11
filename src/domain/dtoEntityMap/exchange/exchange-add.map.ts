import ExchangeAddDto, { NpaExchangeAddDto } from '../../dto/exchange/exchange-add.dto';
import { RequestParam } from '../../dto/haa-common.dto';
import ExchangeAddEntity, { NpaExchangeAddEntity } from '../../entities/exchange/exchange-add.entity';

export class ExchangeAddMap {
    static dtoToEntityForCreate(requestParam: RequestParam): ExchangeAddEntity {
        const entity: ExchangeAddEntity = new ExchangeAddEntity();
        const dto: ExchangeAddDto = requestParam.inputRequest;
        entity.abbreviation = dto.abbreviation.trim();
        entity.fullName = dto.fullName.trim();
        entity.bookNumber = dto.bookNumber;
        entity.sectionNumber = dto.sectionNumber
        entity.createdUserId = dto.createdUserId;
        entity.lastUpdatedUserId = dto.lastUpdatedUserId;
        entity.secondAbbreviation = dto.secondAbbreviation;
        // NpaExchangeAddDto[] to NpaExchangeAddEntity[]
        entity.npa = dto.npa.map((npaDto: NpaExchangeAddDto) => {
            const npaEntity: NpaExchangeAddEntity = new NpaExchangeAddEntity();
            npaEntity.npa = npaDto.npa;
            npaEntity.abbreviation = dto.abbreviation;
            npaEntity.createdUserId = dto.createdUserId;
            npaEntity.fullName = dto.fullName;
            npaEntity.lastUpdatedUserId = dto.lastUpdatedUserId;

            return npaEntity
        });
        return entity;
    }

}
