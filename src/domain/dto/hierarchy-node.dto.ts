export default class HierarchyNodeDto {
  nodeId: string;
  parentHierarchyNodeId: string;
  nodeName: string;
  description1: string | null;
  description2: string | null;
  description3: string | null;
  effectiveDate: string;
}

export class HierarchyNodeRemoveDto {
  hierarchyNodeId: string;
}
