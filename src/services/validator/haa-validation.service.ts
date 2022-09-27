import HaaQueryParams from '../../domain/entities/haa-query-param.entity';
import HaaValidationBaseService from './haa-validation-base.service';

export default abstract class HaaValidationService extends HaaValidationBaseService {
  async validateInputForCreate(queryParams: HaaQueryParams): Promise<any> {
    return;
  }
  async validateInputForUpdate(queryParams: HaaQueryParams): Promise<any> {
    return;
  }
  async validateInputForDelete(queryParams: HaaQueryParams): Promise<any> {
    return;
  }
  async validateInputForGet(queryParams: HaaQueryParams): Promise<any> {
    return;
  }
}
