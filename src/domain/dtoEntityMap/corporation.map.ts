import CorporationDto from '../dto/corporation.dto';
import CorporationEntity from '../entities/corporation.entity';

export class CorporationMap {
  static entityToDto(entities: CorporationEntity[]): CorporationDto[] {
    const dtos = entities.map((entity) => {
      const dto = new CorporationDto();
      dto.cosAddress1 = entity.cosAddress1;
      dto.cosAddress2 = entity.cosAddress2;
      dto.cosAddress3 = entity.cosAddress3;
      dto.cosCity = entity.cosCity;
      dto.cosPostalZip = entity.cosPostalZip;
      dto.psnId = entity.psnId;
      dto.cosName = entity.cosName;
      return dto;
    });
    return dtos;
  }
}
