import oracledb from 'oracledb';
import HaaExtractEntity from '../../../domain/entities/haa-extract.entity';
import { HaaCreateExtractsQueryParams, HaaExtractsQueryParams } from '../../../domain/entities/haa-query-param.entity';
import { BaseDaoOptions } from '../../base.dao';
import HaaBaseDao from '../../haa-base.dao';

export default class HaaExtractsDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({ mapperNamespace: 'haaExtractsMapper', ...options });
    oracledb.fetchAsBuffer = [oracledb.BLOB];
  }

  mapDbResultToEntity(results: any): HaaExtractEntity[] {
    return HaaExtractEntity.transform(results);
  }

  async getEntitiesToDelete(haaQueryParams: HaaExtractsQueryParams): Promise<any> {
    return [{ extractId: haaQueryParams.extractId }];
  }
  
  async getEntitiesToCreate(haaQueryParams: HaaCreateExtractsQueryParams):Promise<HaaExtractEntity[]>{
    const haaExtractEntity = new HaaExtractEntity()
    haaExtractEntity.conId = haaQueryParams.conId!
    haaExtractEntity.hierarchyNodeId = haaQueryParams.hierarchyNodeId!
    haaExtractEntity.languageCode = haaQueryParams.languageCode!
    haaExtractEntity.userId = haaQueryParams.userId!
    haaExtractEntity.status = haaQueryParams.status!
    haaExtractEntity.extractId = haaQueryParams.extractId!
    if (haaQueryParams.extractFile){
      haaExtractEntity.extractFile = haaQueryParams.extractFile!
    }
    if (haaQueryParams.extractFileName){
      haaExtractEntity.extractFileName = haaQueryParams.extractFileName!
    }
    return [haaExtractEntity]
  }

  async getCorpId(hierarchyNodeId:string){
    //will return both cos_corporate_id and corp_id
    const dbResult = await this.findByFilters({
      query: 'getCorpIdByHnId',
      params: {hierarchyNodeId},
    });
    return dbResult[0]
  }

  async getNextExtractId():Promise<number>{
    const dbResult = await this.findByFilters({
      query: 'getNextExtractId'
    });
    return dbResult[0].EXTRACT_ID
  }

  async getColumnTranslation(columns:string){
    const dbResult = await this.findByFilters({
      query: 'getColumnTranslation',
      params: {columns},
    });
    return dbResult
  }

  async updateRejectedStatus(extractId:number,error:any){
    let message = error?.message?.substring(0,2048)?error.message.substring(0,2048) : 'Error generating CSV'
    await this.getResult( {
      query:"updateRejectedStatus", 
      params:{extractId,message}
    } )
  }

  async getUserIdByExtractId(extractId:number){
    const dbResult = await this.findByFilters({
      query:'getUserIdByExtractId',
      params: {extractId}
    })
    return dbResult[0].USER_ID
  }
}
