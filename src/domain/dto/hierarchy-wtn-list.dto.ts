export default class HierarchyWtnListDto {
  parentHierarchyNodeId: string;
  parentHierarchyNodeName: string;
  parentHierarchyNodeLevel: number;
  parentNodeType: string;
  wtnNodeId: string;
  hierarchyNodeLevel: number;
  workingTelephoneNumber: string;
  billingTelephoneNumber: string;
  excludeFromReportCode: string;
  description: string;
  effectiveDate: string;
  canMoveIndicator: string;
  canViewIndicator: string;
}
