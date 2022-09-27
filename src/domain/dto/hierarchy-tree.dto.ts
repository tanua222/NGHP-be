export default class HierarchyTreeDto {
  hierarchyNodeId: string;
  hierarchyNodeName: string;
  hierarchyNodeLevel: number;
  nodeType: string;
  canViewIndicator: number;
  childNodes: HierarchyTreeChildNodesDto[];
}

export class HierarchyTreeChildNodesDto {
  hierarchyNodeId: string;
  hierarchyNodeName: string;
  hierarchyNodeLevel: number;
  nodeType: string;
  childNodes: HierarchyTreeChildNodesDto[];
}
