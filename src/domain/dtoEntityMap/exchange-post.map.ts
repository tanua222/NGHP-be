import ExchangePostDto, { NpaExchangePostDto } from '../dto/exchange-post.dto';
import { RequestParam } from '../dto/haa-common.dto';
import ExchangePostEntity, { NpaExchangePostEntity } from '../entities/exchange-post.entity';

export class ExchangePostMap {
    static dtoToEntityForCreate(requestParam: RequestParam): ExchangePostEntity {
        const entity: ExchangePostEntity = new ExchangePostEntity();
        const dto: ExchangePostDto = requestParam.inputRequest;
        entity.abbreviation = dto.abbreviation.trim();
        entity.fullName = dto.fullName.trim();
        entity.bookNumber = dto.bookNumber;
        entity.sectionNumber = dto.sectionNumber
        entity.createdUserId = dto.createdUserId;
        entity.lastUpdatedUserId = dto.lastUpdatedUserId;
        entity.secondAbbreviation = dto.secondAbbreviation;
        // NpaExchangePostDto[] to NpaExchangePostEntity[]
        entity.npa = dto.npa.map((npaDto: NpaExchangePostDto) => {
            const npaEntity: NpaExchangePostEntity = new NpaExchangePostEntity();
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
