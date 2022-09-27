export default class HierarchyNodeListDto {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  hierarchyNodeLevel: number;
  effectiveDate: string;
  description: string | null;
  parentHierarchyNodeId: string;
  parentHierarchyNodeName: string;
  parentHierarchyNodeLevel: number;
  parentNodeType: string;
  canMoveIndicator: string;
  canViewIndicator: string;
}
