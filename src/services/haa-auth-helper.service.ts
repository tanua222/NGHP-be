import { List } from 'lodash';
import HaaEntityDao from '../dao/features/entities/haa-entity.dao';
import HaaAssignedUserReportDao from '../dao/features/reports/haa-assigned-user-report.dao';
import HierarchyNodeDao from '../dao/node/hierarchy-node.dao';
import Context from '../utils/context';

export default class HaaAuthHelperService {
  context: Context;

  constructor(options: { context: Context }) {
    this.context = options.context;
  }

  async get(params: any): Promise<any> {
    this.context.log.debug('HaaAuthHelperService: get param: ' + JSON.stringify(params));
    switch (params.service) {
      case 'getNodeIdListForEntityNodeIdList':
        return await this.getNodeIdListForEntityNodeIdList(params.entityNodeIdList);
      case 'getNodeIdListForParentNodeId':
        return await this.getNodeIdListForParentNodeId(params.parentNodeId);
      case 'getNodeIdForNDEId':
        return await this.getNodeIdForNDEId(params.NDEId);
      case 'getNodeIdListForAssignedReportIdList':
        return await this.getNodeIdListForAssignedReportIdList(params.assignedReportIdList);
      case 'getNodeIdForAssignedReportId':
        return await this.getNodeIdForAssignedReportId(params.assignedReportId);
      case 'getNodeIdListForNDEIdListAndParentNodeId':
        return await this.getNodeIdListForNDEIdListAndParentNodeId(params.NDEIdList, params.parentNodeId);

      case 'getCorporationIdForEntityNodeIdList':
        return await this.getCorporationIdForEntityNodeIdList(params.entityNodeIdList);
      case 'getCorporationIdForHierarchyNodeIdList':
        return await this.getCorporationIdForHierarchyNodeIdList(params.hierarchyNodeIdList);
      case 'getCorporationIdForHierarchyNodeId':
        return await this.getCorporationIdForHierarchyNodeId(params.hierarchyNodeId);
      case 'getCorporationIdForNDEId':
        return await this.getCorporationIdForNDEId(params.NDEId);
      case 'getCorporationIdForAssignedReportIdList':
        return await this.getCorporationIdForAssignedReportIdList(params.assignedReportIdList);
      case 'getCorporationIdForAssignedReportId':
        return await this.getCorporationIdForAssignedReportId(params.assignedReportId);
      default:
        return 'Not implemented';
    }
  }

  private async getNodeIdListForEntityNodeIdList(entityNodeIdList: number[]): Promise<List<string>> {
    const dao = new HaaEntityDao({ context: this.context });
    let res = await dao.findHierarchyNodeByParams({
      entityNodeIdList: entityNodeIdList,
    });
    return Array.from(new Set(res.map((el) => el.HN_ID)));
  }

  private async getCorporationIdForEntityNodeIdList(entityNodeIdList: number[]): Promise<string> {
    const dao = new HaaEntityDao({ context: this.context });
    let res = await dao.findHierarchyNodeByParams({
      entityNodeIdList: entityNodeIdList,
    });
    return await this.getCorporationIdForHierarchyNodeId(res[0].HN_ID);
  }

  private async getCorporationIdForHierarchyNodeId(hierarchyNodeId: number): Promise<string> {
    const dao = new HierarchyNodeDao({ context: this.context });
    let res = await dao.findHierarchyNodeByParams({
      hierarchyNodeId: hierarchyNodeId,
    });
    return res[0].corpId;
  }

  private async getCorporationIdForHierarchyNodeIdList(hierarchyNodeIdList: number[]): Promise<string> {
    return await this.getCorporationIdForHierarchyNodeId(hierarchyNodeIdList[0]);
  }

  private async getNodeIdListForParentNodeIdList(parentHierarchyNodeIdList: number[]): Promise<List<string>> {
    const dao = new HierarchyNodeDao({ context: this.context });
    let res = await dao.findHierarchyNodeByParams({
      parentHierarchyNodeIdList: parentHierarchyNodeIdList,
    });
    return Array.from(new Set(res.map((el) => el.id)));
  }

  private async getNodeIdListForParentNodeId(parentHierarchyNodeId: number): Promise<List<string>> {
    return await this.getNodeIdListForParentNodeIdList([parentHierarchyNodeId]);
  }

  private async getNodeIdForNDEId(NDEId: string): Promise<string> {
    const dao = new HierarchyNodeDao({ context: this.context });
    let res = await dao.findHierarchyNodeByParams({
      nodeId: NDEId,
    });
    return res.map((el) => el.id)[0];
  }

  private async getCorporationIdForNDEId(NDEId: string): Promise<string> {
    const dao = new HierarchyNodeDao({ context: this.context });
    let res = await dao.findHierarchyNodeByParams({
      nodeId: NDEId,
    });
    return res[0].corpId;
  }

  private async getNodeIdListForNDEIdListAndParentNodeId(
    NDEIdList: string[],
    parentHierarchyId: string
  ): Promise<List<string>> {
    const dao = new HierarchyNodeDao({ context: this.context });
    let res = await dao.findHierarchyNodeByParams({
      nodeIdList: NDEIdList,
    });
    let parentHierarchyIdList = res.map((el) => el.parentHierarchyId);
    parentHierarchyIdList.push(parentHierarchyId);
    return Array.from(new Set(parentHierarchyIdList));
  }

  private async getNodeIdListForAssignedReportIdList(assignedReportIdList: number[]): Promise<List<string>> {
    const dao = new HaaAssignedUserReportDao({ context: this.context });
    let res = await dao.findHierarchyNodeByParams({
      assignedReportIdList: assignedReportIdList,
    });
    return Array.from(new Set(res.map((el) => el.hierarchyNodeId)));
  }

  private async getCorporationIdForAssignedReportIdList(assignedReportIdList: number[]): Promise<string> {
    var nodeId = (await this.getNodeIdListForAssignedReportIdList(assignedReportIdList))[0];
    return this.getCorporationIdForHierarchyNodeId(parseInt(nodeId));
  }

  private async getCorporationIdForAssignedReportId(assignedReportId: number): Promise<string> {
    var nodeId = (await this.getNodeIdListForAssignedReportIdList([assignedReportId]))[0];
    return this.getCorporationIdForHierarchyNodeId(parseInt(nodeId));
  }

  private async getNodeIdForAssignedReportId(assignedReportId: number): Promise<string> {
    return (await this.getNodeIdListForAssignedReportIdList([assignedReportId]))[0];
  }
}
