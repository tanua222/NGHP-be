import HaaExtractsDao from '../../../dao/features/extracts/haa-extracts.dao';
import { HaaExtractCreateRequestParam, HierarchyTreeRequestParam } from '../../../domain/dto/haa-common.dto';
import ResponseDto from '../../../domain/dto/response.dto';
import { HaaCreateExtractsQueryParams } from '../../../domain/entities/haa-query-param.entity';

import Context from '../../../utils/context';
import { AppConfig } from '../../../utils/app-config';
const config = <AppConfig>require('config');
import HaaExtractDto from '../../../domain/dto/haa-extract.dto';
import HaaBasePostService from '../../haa-base-post.service';
import HierarchyTreeService from '../../hierarchy-tree.service';
import PaginationResult from '../../../domain/dto/pagination-result.dto';
import { IvsConnection } from '../../../utils/database';
import oracledb from 'oracledb';
import { Language } from '../../../utils/constants';
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;

export default class HaaExtractCreateService extends HaaBasePostService<HaaExtractsDao> {
  flattenTree: any[];
  path: any[];
  static translationMap:LanguageMap = {
    "curatedFlag":false,
    "E":{
      "Corp ID":"'Corp ID'",
      "Node1 Name":"Node1 Name",
      "Node2 Name":"Node2 Name",
      "Node3 Name":"Node3 Name",
      "Node4 Name":"Node4 Name",
      "Node5 Name":"Node5 Name",
      "Node6 Name":"Node6 Name",
      "Node7 Name":"Node7 Name",
      "Node8 Name":"Node8 Name",
      "Node9 Name":"Node9 Name",
      },
    "F":{
        "Corp ID":"'Corp ID'",
        "Node1 Name":"Node1 Name",
        "Node2 Name":"Node2 Name",
        "Node3 Name":"Node3 Name",
        "Node4 Name":"Node4 Name",
        "Node5 Name":"Node5 Name",
        "Node6 Name":"Node6 Name",
        "Node7 Name":"Node7 Name",
        "Node8 Name":"Node8 Name",
        "Node9 Name":"Node9 Name",
      }
  }

  constructor(context: Context) {
    super({ context, dao: new HaaExtractsDao({ context }) });
    this.flattenTree = [];
    this.path = [];
    HaaExtractCreateService.getTranslationMap()
  }

  static async getTranslationMap(){
    if (!HaaExtractCreateService.translationMap.curatedFlag){
      let languageMap: LanguageMap = HaaExtractCreateService.translationMap
      const context = new Context({ sessionId: `scheduledTask:${Date.now()}` }, true);
      const extractDao = new HaaExtractsDao({ context });
      const columnNames = config.hierarchyExtract.columns;
      const inClause = "'" + columnNames.join("','") + "'";
      const dbRes = await extractDao.getColumnTranslation(inClause)
      dbRes.forEach((translation: {
        LAN_CODE: string; OBJECT_VALUE: any; OBJECT_TRANSLATED_VALUE: any 
      }) => {
        let objName = translation.OBJECT_VALUE;
        let objValue = translation.OBJECT_TRANSLATED_VALUE;
        if (translation.LAN_CODE === 'E'){
          languageMap.E[objName] = objValue
        }else{
          languageMap.F[objName] = objValue
        }
      });
      HaaExtractCreateService.translationMap.curatedFlag = true
    }else{
      return HaaExtractCreateService.translationMap
    }
  }

  async executeTask(param: any): Promise<ResponseDto<any>> {
    try {
      let requestParam: HaaExtractCreateRequestParam = param.params;
      this.conn = await IvsConnection.getConnection(this.dao.dbConfig, this.context);
      const corporationIds = await this.dao.getCorpId(requestParam.hierarchyNodeId!);
      const corpId = corporationIds.CORP_ID;
      const cosCorporateId = corporationIds.COS_CORPORATE_ID;
      requestParam.corporationId = corpId;
      //push the entries into database the first time
      const haaQueryParams: HaaCreateExtractsQueryParams = await this.mapToEntityQueryParams(requestParam);
      this.log.debug(
        'HaaExtractCreateService.executeTask mapToEntityQueryParamsForCreate is done with HaaQueryParams:',
        haaQueryParams
      );
      const entitiesResult: PaginationResult = await this.dao.createDbEntitiesByParams(haaQueryParams, this.conn);
      this.log.debug(
        `HaaBasePostService.createDbEntitiesByParams with query: addRecord is done with entitiesResult: ${entitiesResult}`
      );
      await this.conn.commit();
      this.uploadCSV(haaQueryParams,corpId,cosCorporateId);
      return new ResponseDto<HaaExtractDto>();
    } catch (e) {
      this.log.error(`HaaExtractCreateService.executeTask error: ${e}`);
      await this.conn?.rollback();
      return ResponseDto.catchResponse(this.context, e);
    } finally {
      if (this.conn) {
        try {
          await this.conn.close();
          this.conn = undefined;
        } catch (error) {
          this.log.error("can't close connection", error);
          return ResponseDto.catchResponse(this.context, error);
        }
      }
    }
  }

  async mapToEntityQueryParams(requestParam: HaaExtractCreateRequestParam): Promise<HaaCreateExtractsQueryParams> {
    //status:PENDING
    const queryParam: HaaCreateExtractsQueryParams = new HaaCreateExtractsQueryParams();
    queryParam.extractId = await this.dao.getNextExtractId();
    queryParam.conId = requestParam.corporationId!;
    queryParam.languageCode = requestParam.language;
    queryParam.hierarchyNodeId = requestParam.hierarchyNodeId;
    return queryParam;
  }

  //generate and update database entry with generated CSV blob
  async uploadCSV(queryParam: HaaCreateExtractsQueryParams,corpId:number,cosCorporateId:string) {
    let newConn;
    try {
      newConn = await IvsConnection.getConnection(this.dao.dbConfig, this.context);
      const hierarchyNodeId = queryParam.hierarchyNodeId!;
      const extractId = queryParam.extractId!;
      const language = queryParam.languageCode!;
      const extractFile = await this.getHierarchyTreeExtractFile(hierarchyNodeId, corpId, language,cosCorporateId);
      const extractFileName = this.generateFileName(hierarchyNodeId);
      this.log.info(`HaaExtractCreateService generate file ${extractFileName} success`);
      await this.updateOutputFile(extractId, extractFile, extractFileName, newConn);
      this.log.info(`HaaExtractCreateService update Output File success`);
      //await newConn.commit()
    } catch (error) {
      try {
        //update the table with rejected status and error message
        const extractId = queryParam.extractId!;
        await this.dao.updateRejectedStatus(extractId, error);
        await newConn?.commit();
        this.log.error(`HaaExtractCreateService.uploadCSV error: ${error}`);
      } catch (error) {
        await newConn?.rollback();
        return ResponseDto.catchResponse(this.context, error);
      }
    } finally {
      if (newConn) {
        try {
          await newConn.commit();
          await newConn.close();
          newConn = undefined;
        } catch (error) {
          this.log.error("can't close connection", error);
          return ResponseDto.catchResponse(this.context, error);
        }
      }
    }
  }


  private async getHierarchyTreeExtractFile(hierarchyNodeId: string, corpId: number, languageCode: Language,cosCorporateId:string) {
    let params = new HierarchyTreeRequestParam();
    params.corporationId = corpId;
    params.includeWTN = true;
    let hierarchyTreeService = new HierarchyTreeService(this.context);
    let hierarchyTreeDto = (await hierarchyTreeService.executeTask({ params })).result;
    let hierarchyTree: HaaExtractNode = this.mapHierarchyTree(hierarchyTreeDto);
    let subTree: HaaExtractNode | undefined = this.getSubTree(hierarchyTree, hierarchyNodeId);
    if (subTree) {
      this.getFlattenTree(subTree!, this.path, 0, cosCorporateId);
      return this.generateCSV(this.flattenTree, languageCode);
    } else {
      throw Error('subTree not found');
    }
  }

  //map hierarchyTreeDto to ExtractNode
  private mapHierarchyTree(node: any): HaaExtractNode {
    let extractNode = new HaaExtractNode();
    extractNode.hierarchyNodeId = node.hierarchyNodeId;
    extractNode.hierarchyNodeName = node.hierarchyNodeName;
    extractNode.nodeType = node.nodeType;
    node.childNodes.map((child: any) => {
      this.mapHierarchyTree(child);
    });
    extractNode.childNodes = node.childNodes;
    return extractNode;
  }

  private getSubTree(hierarchyTree: HaaExtractNode, hierarchyNodeId: String): HaaExtractNode | undefined {
    if (hierarchyTree.hierarchyNodeId == hierarchyNodeId) {
      return hierarchyTree;
    } else {
      for (let i = 0; i < hierarchyTree.childNodes.length; i++) {
        let subtree = this.getSubTree(hierarchyTree.childNodes[i], hierarchyNodeId);
        if (subtree) {
          return subtree;
        }
      }
    }
  }

  //flatten hierarchy tree to list of nodes
  private getFlattenTree(subTree: HaaExtractNode, path: any[], pathLen: number, cosCorporateId: string): void {
    path[pathLen] = subTree.hierarchyNodeName;
    let CSVObj = this.generateCSVObj(cosCorporateId, Array.from(path));
    this.flattenTree.push(CSVObj);
    pathLen++;
    if (subTree.childNodes.length != 0) {
      subTree.childNodes.forEach((childNode) => {
        this.getFlattenTree(childNode, path, pathLen, cosCorporateId);
      });
    }
  }

  //map node to CSV object
  private generateCSVObj(cosCorporateId: string, path: any[]) {
    let obj = {
      "Corp ID": cosCorporateId,
      "Node1 Name": path[0],
      "Node2 Name": path[1],
      "Node3 Name": path[2],
      "Node4 Name": path[3],
      "Node5 Name": path[4],
      "Node6 Name": path[5],
      "Node7 Name": path[6],
      "Node8 Name": path[7],
      "Node9 Name": path[8],
    };
    return obj;
  }

  private async generateCSV(flattenedSubTree: any[], languageCode: Language) {
    let languageMap = (HaaExtractCreateService.translationMap)[languageCode]
    let csvStringifier;
    csvStringifier = createCsvStringifier({
      header: [
        { id: 'Corp ID', title: languageMap["Corp ID"] },
        { id: 'Node1 Name', title: languageMap["Node1 Name"] },
        { id: 'Node2 Name', title: languageMap["Node2 Name"] },
        { id: 'Node3 Name', title: languageMap["Node3 Name"] },
        { id: 'Node4 Name', title: languageMap["Node4 Name"] },
        { id: 'Node5 Name', title: languageMap["Node5 Name"] },
        { id: 'Node6 Name', title: languageMap["Node6 Name"] },
        { id: 'Node7 Name', title: languageMap["Node7 Name"] },
        { id: 'Node8 Name', title: languageMap["Node8 Name"] },
        { id: 'Node9 Name', title: languageMap["Node9 Name"] },
      ],
    });
    const header = csvStringifier.getHeaderString(flattenedSubTree);
    const content = csvStringifier.stringifyRecords(flattenedSubTree);
    const csv = " ," + header + content; //so that corp will not be ignored when download
    this.log.info('HaaExtractCreateService generateCSV success generate csv:', csv);
    const blob = Buffer.from(csv);
    return blob;
  }

  private generateFileName(hierarchyNodeId: string): string {
    const userId = this.context.get('uuid')
    const date = new Date().toISOString();
    return 'hierarchy_' + userId + '_' + date + '_' + hierarchyNodeId + '.csv';
  }

  async updateOutputFile(extractId: number, extractFile: any, fileName: string, conn: IvsConnection) {
    //throw Error('test error')
    let timestampBegin = Date.now();
    await conn.execute(
      `UPDATE THIERARCHY_EXTRACT
          SET
            EXTRACT_FILE_NAME = :fileName,
            EXTRACT_FILE = :extractFile,
            STATUS = 'COMPLETED',
            UPDATED_BY = :uuid,
            UPDATED_ON = SYSDATE
          WHERE EXTRACT_ID = :extractId`,
      {
        extractId: extractId,
        fileName: fileName,
        uuid: this.context.get('uuid'),
        extractFile: {
          val: extractFile,
          type: oracledb.BLOB,
          dir: oracledb.BIND_IN,
        },
      },
      { autoCommit: true }
    );
    let timestampEnd = Date.now();
    if(config.enableQueryTime){
      let executionTime = timestampEnd - timestampBegin;
      this.log.debug("MapperNamespace: THierarchyExtractMapper, SQLId: UpdateTHierarchyExtract, Query Execution Time: ",executionTime+"ms");
    }
  }
}

class HaaExtractNode {
  hierarchyNodeId: string;
  hierarchyNodeName: string;
  nodeType: string;
  childNodes: HaaExtractNode[];
}

class LanguageMap{
  E:Record<string, any> = {}
  F:Record<string, any> = {}
  //if the languageMap generated from database data or not
  curatedFlag:boolean
}
