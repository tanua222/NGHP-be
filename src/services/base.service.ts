import Logger from 'bunyan';
import BaseDao, { BaseArgs, BaseServiceOptions } from '../dao/base.dao';
import ResponseDto from '../domain/dto/response.dto';
import { BaseDto } from '../domain/dto/haa-common.dto';
import BaseEntity from '../domain/entities/base.entity';
import { ErrorMapping } from '../error/error-responses-mapping';
import Context from '../utils/context';
import { isExternalUser } from '../utils/util';

export default class BaseService<DAO extends BaseDao> {
  isExternalUser: boolean = false;
  dao: DAO;
  context: Context;
  log: Logger;

  constructor(options: BaseServiceOptions) {
    this.context = options.context;
    this.log = options.context.log;
    this.dao = options.dao;
    this.isExternalUser = isExternalUser(this.context);
  }

  async findById(args: BaseArgs) {
    return await this.dao.findById(args);
  }

  async find(args: BaseArgs) {
    return await this.dao.findByFilters(args);
  }

  async paginate(args: BaseArgs) {
    return await this.dao.paginateByFilters(args);
  }

  async add(args: BaseArgs) {
    return await this.dao.add(args);
  }

  async update(args: BaseArgs) {
    return await this.dao.update(args);
  }

  async delete(args: BaseArgs) {
    return await this.dao.delete(args);
  }

  async executeTask(args: any): Promise<ResponseDto<any>> {
    throw new Error('Method not implemented.');
  }

  mapEntityToDto(ivsEntity: BaseEntity[]): BaseDto[] {
    throw ResponseDto.internalErrorCode(this.context, ErrorMapping.IVSHAA4401, {
      function: 'mapEntityToDto(ivsEntity: BaseEntity[])',
    });
  }
}
