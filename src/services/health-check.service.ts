import HealthCheckDao from '../dao/health-check.dao';
import ResponseDto from '../domain/dto/response.dto';
import Context from '../utils/context';
import BaseService from './base.service';

export default class HealthCheckService extends BaseService<HealthCheckDao> {
  constructor(context: Context) {
    super({ context, dao: new HealthCheckDao({ context: context }) });
  }

  async healthCheck(): Promise<any> {
    try {
      const result = await this.dao.healthCheck();
      return {
        result: 'success',
      };
    } catch (error) {
      this.log.error(error);
      return ResponseDto.internalError();
    }
  }
}
