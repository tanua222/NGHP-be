export default class BaseEntity {
  entityNodeId: string;
  hierarchyNodeId: string;
  entitySequenceId: string;
  entityType?: string;
}

export class NodeInfo {
  constructor(
    readonly ornId: string,
    readonly nodeTypeCode: string,
    readonly nodeNumber: string,
    readonly nodeName: string
  ) {}
}

export enum EntityAction {
  NO_CHANGE = 'noc',
  ADD = 'add',
  DELETE = 'delete',
  UPDATE = 'update',
}
export class HaaHierarchyNodeEntity extends BaseEntity {
  entityEffectiveDate: string;
  entityId: string;
  hierarchyNodeName: string;
  hierarchyNodeLevel: number;
  nodeType: string;
  canUnassignIndicator: string;
}
