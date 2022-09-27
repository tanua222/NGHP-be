import HaaFileDto from '../dto/haa-file.dto';
import HaaExtractEntity from '../entities/haa-extract.entity';

export class HaaExtractFileMap {
  static entityToDto(entities: HaaExtractEntity[]): HaaFileDto[] {
    const dtos = entities.map((entity) => {
      const dto = new HaaFileDto();
      dto.file = entity.extractFile;
      return dto;
    });
    return dtos;
  }
}
