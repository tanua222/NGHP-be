import HaaBaseDao from '../../../../dao/haa-base.dao';
import Error from '../../../../domain/dto/error.dto';
import { errorResponse } from '../../../../error/error-responses';
import { ErrorMapping } from '../../../../error/error-responses-mapping';
import HaaValidationBaseService from '../../haa-validation-base.service';
import HaaExtractsDao from '../../../../dao/features/extracts/haa-extracts.dao';

export default class HaaExtractsValidatorService extends HaaValidationBaseService {
  haaExtractsDao: HaaExtractsDao;

  constructor(dao: HaaBaseDao) {
    super(dao);
    this.haaExtractsDao = new HaaExtractsDao({ context: this.context });
  }

  //for both Delete and Get extract by extractId
  async validateIfUserPermitted(extractId: number): Promise<any> {
    const errors: Error[] = [];
    const User = await this.haaExtractsDao.getUserIdByExtractId(extractId)
    if (User != this.context.userId) {
      errors.push(errorResponse(ErrorMapping.IVSHAA4437, this.context,));
    }
    this.returnValidationErrors(errors);
  }
}