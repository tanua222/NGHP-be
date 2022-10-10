import ExchangePostDto, { NpaExchangePostDto } from '../dto/exchange-post.dto';
import { RequestParam } from '../dto/haa-common.dto';
import ExchangePostEntity, { NpaExchangePostEntity } from '../entities/exchange-post.entity';

export class ExchangePostMap {
    static dtoToEntityForCreate(requestParam: RequestParam): ExchangePostEntity {
        const entity: ExchangePostEntity = new ExchangePostEntity();
        const dto: ExchangePostDto = requestParam.inputRequest;
        entity.abbrev = dto.abbrev.trim();
        entity.exchangeFullName = dto.exchangeFullName.trim();
        entity.bookNum = dto.bookNum;
        entity.sectionNum = dto.sectionNum
        entity.createdUserId = dto.createdUserId;
        entity.lastUpdatedUserId = dto.lastUpdatedUserId;
        entity.secondAbbrev = dto.secondAbbrev;
        // NpaExchangePostDto[] to NpaExchangePostEntity[]
        entity.npa = dto.npa.map((npaDto: NpaExchangePostDto) => {
            const npaEntity: NpaExchangePostEntity = new NpaExchangePostEntity();
            npaEntity.bnemNpa = npaDto.bnemNpa;
            npaEntity.abbrev = dto.abbrev;
            npaEntity.createdUserId = dto.createdUserId;
            npaEntity.exchangeFullName = dto.exchangeFullName;
            npaEntity.lastUpdatedUserId = dto.lastUpdatedUserId;

            return npaEntity
        });
        return entity;
    }

}
