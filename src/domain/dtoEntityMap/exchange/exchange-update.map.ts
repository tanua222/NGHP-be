import ExchangeUpdateDto, { NpaExchangeUpdateDto } from '../../dto/exchange/exchange-update.dto';
import { RequestParam } from '../../dto/haa-common.dto';
import ExchangeUpdateEntity, { NpaExchangeUpdateEntity } from '../../entities/exchange/exchange-update.entity';

export class ExchangeUpdateMap {
    static dtoToEntityForUpdate(requestParam: RequestParam): ExchangeUpdateEntity[] {
        const entities: ExchangeUpdateEntity[] = requestParam.inputRequest.map((dto: ExchangeUpdateDto) => {
            const entity: ExchangeUpdateEntity = new ExchangeUpdateEntity();
            entity.abbreviation = dto.abbreviation.trim();
            entity.fullName = dto.fullName.trim();
            entity.bookNumber = dto.bookNumber;
            entity.sectionNumber = dto.sectionNumber
            entity.createdUserId = dto.createdUserId;
            entity.lastUpdatedUserId = dto.lastUpdatedUserId;
            entity.secondAbbreviation = dto.secondAbbreviation;
            // NpaExchangeUpdateDto[] to NpaExchangeUpdateEntity[]
            if (dto.npa) { 
                entity.npa = dto.npa.map((npaDto: NpaExchangeUpdateDto) => {
                    const npaEntity: NpaExchangeUpdateEntity = new NpaExchangeUpdateEntity();
                    npaEntity.id = npaDto.id;
                    npaEntity.npa = npaDto.npa;

                    return npaEntity;
                });
            }
            return entity;
        })
        return entities;
    }

}
