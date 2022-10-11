import { BaseDaoOptions } from './../base.dao';
import ExchangeBaseDao from './exchange-base.dao';

export default class ExchangeGetDao extends ExchangeBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      ...options,
    });
  }

}
