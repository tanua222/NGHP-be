import { SortParam } from '../domain/dto/haa-common.dto';
import PaginationResult from '../domain/dto/pagination-result.dto';
import ResponseDto, { Error } from '../domain/dto/response.dto';
import BaseEntity from '../domain/entities/base.entity';
import HaaQueryParams from '../domain/entities/haa-query-param.entity';
import { isDataUpdated } from '../utils/util';
import BaseDao, { BaseArgs, BaseDaoOptions } from './base.dao';

export default class HaaBaseDao extends BaseDao {
  constructor(options: BaseDaoOptions) {
    super(options);
  }

  async paginateByFilters(args: BaseArgs): Promise<PaginationResult> {
    const { params, query } = args;
    const sortConditions =
      params.paginationParam?.paginationRequired &&
      params?.sortParams?.length &&
      this.mapEntityParamsToDbColumns(params?.sortParams)?.map(
        (s1: SortParam) => s1.fieldName + (s1.asc ? ' ASC' : ' DESC')
      );
    sortConditions && (params.sortConditions = sortConditions);
    params?.sortParams && delete params?.sortParams;
    const dbResults = await super.findByFilters({ params: params, query });

    const entities = dbResults?.length > 0 ? this.mapDbResultToEntity(dbResults) : undefined;
    const paginationResult: PaginationResult = this.preparePaginationResult(params, dbResults, entities);
    return paginationResult;
  }

  preparePaginationResult(
    haaQueryParams: HaaQueryParams,
    preresult: any,
    entities: any,
    orderCUD: boolean = false
  ): PaginationResult {
    let result = new PaginationResult();
    if (!preresult?.length && !orderCUD) {
      !orderCUD && (result.noRecordFound = true);
      return result;
    }

    // don't need pagiantion for order CUD operations
    const inputPaginationRequired = haaQueryParams.paginationParam?.paginationRequired && !orderCUD;
    const inputLimit = haaQueryParams.paginationParam?.limit;

    result.paginationRequired = inputPaginationRequired ? 1 : 0;
    result.numberOfPages = inputPaginationRequired ? preresult[0]?.TOTAL_PAGES : 1;
    result.numberOfRows = inputPaginationRequired ? preresult[0]?.TOTAL_ROWS : preresult?.length || 1;
    result.limit = inputPaginationRequired
      ? inputLimit > result.numberOfRows
        ? result.numberOfRows
        : inputLimit
      : preresult?.length || 1;
    result.rows = entities;

    // this.log.debug(`BaseHaaDao.preparePaginationResult result : ${result} based on dbResults : ${preresult}`);
    return result;
  }

  async createDbEntitiesByParams(
    haaQueryParams: HaaQueryParams,
    connection: any = undefined
  ): Promise<PaginationResult> {
    haaQueryParams.entities = await this.getEntitiesToCreate(haaQueryParams);
    const dbResults = (await this.createHaaEntitiesInDB(haaQueryParams, connection)) || [];
    const craetedEntries: BaseEntity[] = this.entitiesToReturnForCreate(haaQueryParams);
    const paginationResult: PaginationResult = this.preparePaginationResultForCreate(haaQueryParams, craetedEntries);
    return paginationResult;
  }

  /**
   * Override this in case you want to return more than the basic entity structure
   * ceated as part of getEntitiesToCreate
   */
  entitiesToReturnForCreate(haaQueryParams: HaaQueryParams): BaseEntity[] {
    return haaQueryParams.entities;
  }

  async getEntitiesToCreate(haaQueryParams: HaaQueryParams): Promise<any> {
    const inputEntties = <BaseEntity[]>haaQueryParams.entities || [new BaseEntity()];
    for await (const e1 of inputEntties) {
      await this.entityToCreate(e1, haaQueryParams);
    }
    return inputEntties;
  }

  async createHaaEntitiesInDB(haaQueryParams: HaaQueryParams, connection: any = undefined): Promise<any> {
    if (!haaQueryParams?.entities?.length) {
      return;
    }
    for await (const entityToCreate of haaQueryParams?.entities) {
      const params = {
        dbEntity: entityToCreate,
        commonEntity: haaQueryParams,
      };
      const dbResult = await this.add({ params, connection });
      if (!isDataUpdated(dbResult)) {
        throw ResponseDto.internalError(
          `createHaaEntitiesInDB addRecord query failed with params + ${JSON.stringify(params, null, 2)}`
        );
      }
    }
  }

  async entityToCreate(e1: BaseEntity, haaQueryParams: HaaQueryParams): Promise<BaseEntity> {
    throw new Error('METHOD_NOT_IMPLEMENTED', 'Method not implemented.', 'Method not implemented.');
  }

  preparePaginationResultForCreate(haaQueryParams: HaaQueryParams, createdEntites: BaseEntity[]): PaginationResult {
    let result = new PaginationResult();

    result.paginationRequired = 0;
    result.numberOfPages = 1;
    result.numberOfRows = 1;
    result.limit = 1;
    result.rows = createdEntites;

    this.log.debug(`BaseHaaDao.preparePaginationResultForCreate result : ${result}`);
    return result;
  }

  async deleteDbEntitiesByParams(
    haaQueryParams: HaaQueryParams,
    connection: any = undefined
  ): Promise<PaginationResult> {
    haaQueryParams.entities = await this.getEntitiesToDelete(haaQueryParams);
    const dbResults = (await this.deleteHaaEntitiesInDB(haaQueryParams, connection)) || [];
    const paginationResult: PaginationResult = this.preparePaginationResultForDelete(haaQueryParams, dbResults);
    return paginationResult;
  }

  // in most of the cases , entity structure with id to delete should be good enough
  // keeping it just to give an option to overide in case needed
  async getEntitiesToDelete(haaQueryParams: HaaQueryParams): Promise<any> {
    return haaQueryParams.entities;
  }

  async deleteHaaEntitiesInDB(haaQueryParams: HaaQueryParams, connection: any = undefined): Promise<any> {
    if (!haaQueryParams?.entities?.length) {
      return;
    }
    for await (const entity of haaQueryParams.entities) {
      const params = {
        dbEntity: entity,
        commonEntity: haaQueryParams,
      };
      const dbResult = await this.delete({ params, connection });
      if (!isDataUpdated(dbResult)) {
        this.log.debug(
          'deleteHaaEntitiesInDB deleteRecord query failed with params: ' + JSON.stringify(params, null, 2)
        );
        throw ResponseDto.notFoundError(this.context);
      }
    }
  }

  preparePaginationResultForDelete(haaQueryParams: HaaQueryParams, dbResults: BaseEntity[]): PaginationResult {
    return new PaginationResult();
  }

  async updateDbEntitiesByParams(
    haaQueryParams: HaaQueryParams,
    connection: any = undefined
  ): Promise<PaginationResult> {
    haaQueryParams.entities = await this.getEntitiesToUpdate(haaQueryParams);
    const dbResults = (await this.updateHaaEntitiesInDB(haaQueryParams, connection)) || [];
    const paginationResult: PaginationResult = this.preparePaginationResultForUpdate(haaQueryParams, dbResults);
    return paginationResult;
  }

  async getEntitiesToUpdate(haaQueryParams: HaaQueryParams): Promise<any> {
    return haaQueryParams.entities;
  }

  async updateHaaEntitiesInDB(haaQueryParams: HaaQueryParams, connection: any = undefined): Promise<any> {
    if (!haaQueryParams?.entities?.length) {
      return;
    }
    for await (const entity of haaQueryParams.entities) {
      const params = {
        dbEntity: entity,
        commonEntity: haaQueryParams,
      };
      const dbResult = await this.update({ params, connection });
      if (!(dbResult && dbResult.rowsAffected >= 1)) {
        this.log.debug(
          'updateHaaEntitiesInDB updateRecord query failed with params: ' + JSON.stringify(params, null, 2)
        );
        throw ResponseDto.notFoundError(this.context);
      }
    }
  }

  preparePaginationResultForUpdate(haaQueryParams: HaaQueryParams, dbResults: BaseEntity[]): PaginationResult {
    return new PaginationResult();
  }

  mapDbResultToEntity(results: any): BaseEntity[] {
    throw new Error('METHOD_NOT_IMPLEMENTED', 'Method not implemented.', 'Method not implemented.');
  }

  mapEntityParamsToDbColumns(haaQueryParams: any): any {
    throw new Error('METHOD_NOT_IMPLEMENTED', 'Method not implemented.', 'Method not implemented.');
  }
}
