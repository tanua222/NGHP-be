import HaaExtractsDao from '../../../dao/features/extracts/haa-extracts.dao';
import { HaaBaseDto } from '../../../domain/dto/haa-common.dto';
import PaginationResult from '../../../domain/dto/pagination-result.dto';
import ResponseDto from '../../../domain/dto/response.dto';
import { HaaExtractFileMap } from '../../../domain/dtoEntityMap/haa-extract-file.map';
import HaaExtractEntity from '../../../domain/entities/haa-extract.entity';
import HaaQueryParams from '../../../domain/entities/haa-query-param.entity';
import Context from '../../../utils/context';
import HaaBaseGetService from '../../haa-base-get.service';
import HaaExtractsValidatorService from '../../validator/features/extracts/haa-extracts-validation.service';

export default class HaaExtractFileService extends HaaBaseGetService<HaaExtractsDao> {
  constructor(context: Context) {
    super({ context, dao: new HaaExtractsDao({ context }) });
  }

  async executeTask(requestParam: any): Promise<ResponseDto<any>>{
      return await super.retrieveHaaEntity(requestParam.params)
  }

  mapEntityToDto(ivsEntity: HaaExtractEntity[]) {
    return HaaExtractFileMap.entityToDto(ivsEntity);
  }

  prepareCommonResponse(resDto: HaaBaseDto[], entitiesResult: PaginationResult): ResponseDto<HaaBaseDto> {
    const response: any = super.prepareCommonResponse(resDto, entitiesResult);
    response.result = response.result?.file || new Uint8Array();
    return response;
  }
  
  async validateInput(query:HaaQueryParams){
    const extractId = parseInt(query.entityId!)
    const validationService: HaaExtractsValidatorService = new HaaExtractsValidatorService(this.dao);
    await validationService.validateIfUserPermitted(extractId);
  }

}
