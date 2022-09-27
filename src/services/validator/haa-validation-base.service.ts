import HaaBaseDao from '../../dao/haa-base.dao';
import ResponseDto, { Error } from '../../domain/dto/response.dto';
import Context from '../../utils/context';

export default abstract class HaaValidationBaseService {
  context: Context;
  log: any;
  dao: HaaBaseDao;

  constructor(dao?: HaaBaseDao) {
    if (dao) {
      this.dao = dao;
      this.setContext(dao.context);
    }
  }

  returnValidationErrors(errors: Error[]) {
    ResponseDto.returnValidationErrors(errors);
  }

  setContext(context: Context) {
    this.context = context;
    this.log = context?.log || this.log;
  }
}
