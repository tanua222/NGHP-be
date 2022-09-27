import { AuthorizationMappingDefinition, Source } from './authorization-mapping-types';

export const AuthorizationMappingExternal: AuthorizationMappingDefinition[] = [
  {
    path: 'tollFreeNumberEntity',
    method: 'GET',
    authorization: [
      {
        authorizationType: 'externalUserOfCorporation',
        privilegeName: 'VIEW-NODE',
        corporationId: {
          source: Source.query,
          param: 'corporationId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'tollFreeNumberEntity/unassign',
    method: 'POST',
    authorization: [
      {
        authorizationType: 'forNodeList',
        privilegeName: 'ASSIGN-TF-ENTITY',
        hierarchyNodeId: {
          source: Source.helperService,
          service: 'getNodeIdListForEntityNodeIdList',
          helperArguments: {
            entityNodeIdList: {
              source: Source.body,
              param: 'list.entityNodeId',
            },
          },
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'tollFreeNumberEntity/assign',
    method: 'POST',
    authorization: [
      {
        authorizationType: 'forNodeList',
        privilegeName: 'ASSIGN-TF-ENTITY',
        hierarchyNodeId: {
          source: Source.body,
          param: 'list.parentHierarchyNodeId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'tollFreeNumberEntity/assignable',
    method: 'GET',
    authorization: [
      {
        authorizationType: 'forNode',
        privilegeName: 'ASSIGN-TF-ENTITY',
        hierarchyNodeId: {
          source: Source.query,
          param: 'parentHierarchyNodeId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'idCodeSetEntity/assignable',
    method: 'GET',
    authorization: [
      {
        authorizationType: 'forNode',
        privilegeName: 'ASSIGN-ICSET-ENTITY',
        hierarchyNodeId: {
          source: Source.query,
          param: 'parentHierarchyNodeId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'idCodeSetEntity/unassign',
    method: 'POST',
    authorization: [
      {
        authorizationType: 'forNodeList',
        privilegeName: 'ASSIGN-ICSET-ENTITY',
        hierarchyNodeId: {
          source: Source.helperService,
          service: 'getNodeIdListForEntityNodeIdList',
          helperArguments: {
            entityNodeIdList: {
              source: Source.body,
              param: 'list.entityNodeId',
            },
          },
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'idCodeSetEntity/assign',
    method: 'POST',
    authorization: [
      {
        authorizationType: 'forNodeList',
        privilegeName: 'ASSIGN-ICSET-ENTITY',
        hierarchyNodeId: {
          source: Source.body,
          param: 'list.parentHierarchyNodeId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'workingTelephoneNumber/add',
    method: 'POST',
    authorization: [
      {
        authorizationType: 'forNode',
        privilegeName: 'MAINTAIN-WTN',
        hierarchyNodeId: {
          source: Source.body,
          param: 'parentHierarchyNodeId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'hierarchyNode',
    method: 'POST',
    authorization: [
      {
        authorizationType: 'forNode',
        privilegeName: 'MAINTAIN-NODE',
        hierarchyNodeId: {
          source: Source.body,
          param: 'parentHierarchyNodeId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'hierarchyNode',
    method: 'GET',
    authorization: [
      {
        authorizationType: 'externalUserOfCorporation',
        privilegeName: 'VIEW-NODE',
        corporationId: {
          source: Source.query,
          param: 'corporationId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'idCodeSetEntity',
    method: 'GET',
    authorization: [
      {
        authorizationType: 'externalUserOfCorporation',
        privilegeName: 'VIEW-NODE',
        corporationId: {
          source: Source.query,
          param: 'corporationId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'accountCodeSetEntity/assignable',
    method: 'GET',
    authorization: [
      {
        authorizationType: 'forNode',
        privilegeName: 'ASSIGN-ACSET-ENTITY',
        hierarchyNodeId: {
          source: Source.query,
          param: 'parentHierarchyNodeId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'user/unassign',
    method: 'POST',
    authorization: [
      {
        authorizationType: 'forNodeList',
        privilegeName: 'ASSIGN-USER-ROLE',
        hierarchyNodeId: {
          source: Source.body,
          param: 'list.parentHierarchyNodeId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'user/assignableRole',
    method: 'GET',
    authorization: [
      {
        authorizationType: 'forNode',
        privilegeName: 'ASSIGN-USER-ROLE',
        hierarchyNodeId: {
          source: Source.query,
          param: 'parentHierarchyNodeId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'user/assignable',
    method: 'GET',
    authorization: [
      {
        authorizationType: 'forNode',
        privilegeName: 'ASSIGN-USER-ROLE',
        hierarchyNodeId: {
          source: Source.query,
          param: 'parentHierarchyNodeId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'user',
    method: 'GET',
    authorization: [
      {
        authorizationType: 'externalUserOfCorporation',
        privilegeName: 'VIEW-NODE',
        corporationId: {
          source: Source.query,
          param: 'corporationId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'user/update',
    method: 'PATCH',
    authorization: [
      {
        authorizationType: 'forNode',
        privilegeName: 'ASSIGN-USER-ROLE',
        hierarchyNodeId: {
          source: Source.body,
          param: 'parentHierarchyNodeId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'user/detail',
    method: 'GET',
    authorization: [
      {
        authorizationType: 'forNode',
        privilegeName: 'VIEW-NODE',
        hierarchyNodeId: {
          source: Source.query,
          param: 'hierarchyNodeId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'hierarchyNode/:nodeId',
    method: 'GET',
    authorization: [
      {
        authorizationType: 'forNode',
        privilegeName: 'VIEW-NODE',
        hierarchyNodeId: {
          source: Source.helperService,
          service: 'getNodeIdForNDEId',
          helperArguments: {
            NDEId: {
              source: Source.path,
              param: 'nodeId',
            },
          },
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'hierarchyNode/:nodeId',
    method: 'PATCH',
    authorization: [
      {
        authorizationType: 'forNode',
        privilegeName: 'MAINTAIN-NODE',
        hierarchyNodeId: {
          source: Source.helperService,
          service: 'getNodeIdForNDEId',
          helperArguments: {
            NDEId: {
              source: Source.path,
              param: 'nodeId',
            },
          },
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'hierarchyNode/:nodeId',
    method: 'DELETE',
    authorization: [
      {
        authorizationType: 'forNode',
        privilegeName: 'MAINTAIN-NODE',
        hierarchyNodeId: {
          source: Source.helperService,
          service: 'getNodeIdForNDEId',
          helperArguments: {
            NDEId: {
              source: Source.path,
              param: 'nodeId',
            },
          },
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'hierarchyNode/move',
    method: 'POST',
    authorization: [
      {
        authorizationType: 'forNodeList',
        privilegeName: 'MOVE-NODE',
        hierarchyNodeId: {
          source: Source.helperService,
          service: 'getNodeIdListForNDEIdListAndParentNodeId',
          helperArguments: {
            NDEIdList: {
              source: Source.body,
              param: 'nodeId',
            },
            parentNodeId: {
              source: Source.body,
              param: 'targetParentHierarchyNodeId',
            },
          },
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'workingTelephoneNumber/move',
    method: 'POST',
    authorization: [
      {
        authorizationType: 'forNodeList',
        privilegeName: 'MOVE-WTN',
        hierarchyNodeId: {
          source: Source.helperService,
          service: 'getNodeIdListForNDEIdListAndParentNodeId',
          helperArguments: {
            NDEIdList: {
              source: Source.body,
              param: 'wtnNodeId',
            },
            parentNodeId: {
              source: Source.body,
              param: 'targetParentHierarchyNodeId',
            },
          },
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'retrieveHierarchyTree',
    method: 'POST',
    authorization: [
      {
        authorizationType: 'externalUserOfCorporation',
        privilegeName: 'VIEW-NODE',
        corporationId: {
          source: Source.query,
          param: 'corporationId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'hierarchyExtract/:extractId',
    method: 'DELETE',
    authorization: [
      {
        authorizationType: 'allowed',
        disabled: false,
      },
    ],
  },
  {
    path: 'hierarchyExtract/:extractId',
    method: 'POST',
    authorization: [
      {
        authorizationType: 'allowed',
        disabled: false,
      },
    ],
  },
  {
    path: 'hierarchyExtract',
    method: 'GET',
    authorization: [
      {
        authorizationType: 'allowed',
        disabled: false,
      },
    ],
  },
  {
    path: 'hierarchyExtract',
    method: 'POST',
    authorization: [
      {
        authorizationType: 'allowed',
        disabled: false,
      },
    ],
  },
  {
    path: 'userReport/assignable',
    method: 'GET',
    authorization: [
      {
        authorizationType: 'forNode',
        privilegeName: 'ASSIGN-REPORT',
        hierarchyNodeId: {
          source: Source.query,
          param: 'parentHierarchyNodeId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'userReport/unassign',
    method: 'POST',
    authorization: [
      {
        authorizationType: 'forNodeList',
        privilegeName: 'ASSIGN-REPORT',
        hierarchyNodeId: {
          source: Source.helperService,
          service: 'getNodeIdListForAssignedReportIdList',
          helperArguments: {
            assignedReportIdList: {
              source: Source.body,
              param: 'list.assignedReportId',
            },
          },
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'userReport/reassign',
    method: 'POST',
    authorization: [
      {
        authorizationType: 'forNodeList',
        privilegeName: 'ASSIGN-REPORT',
        hierarchyNodeId: {
          source: Source.helperService,
          service: 'getNodeIdListForAssignedReportIdList',
          helperArguments: {
            assignedReportIdList: {
              source: Source.body,
              param: 'assignedReportId',
            },
          },
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'userReport/:assignedReportId',
    method: 'GET',
    authorization: [
      {
        authorizationType: 'forNode',
        privilegeName: 'VIEW-NODE',
        hierarchyNodeId: {
          source: Source.helperService,
          service: 'getNodeIdForAssignedReportId',
          helperArguments: {
            assignedReportId: {
              source: Source.path,
              param: 'assignedReportId',
            },
          },
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'userReport/:assignedReportId',
    method: 'PATCH',
    authorization: [
      {
        authorizationType: 'forNode',
        privilegeName: 'ASSIGN-REPORT',
        hierarchyNodeId: {
          source: Source.helperService,
          service: 'getNodeIdForAssignedReportId',
          helperArguments: {
            assignedReportId: {
              source: Source.path,
              param: 'assignedReportId',
            },
          },
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'userReport/assign',
    method: 'POST',
    authorization: [
      {
        authorizationType: 'forNode',
        privilegeName: 'ASSIGN-REPORT',
        hierarchyNodeId: {
          source: Source.body,
          param: 'parentHierarchyNodeId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'userReport',
    method: 'GET',
    authorization: [
      {
        authorizationType: 'externalUserOfCorporation',
        privilegeName: 'VIEW-NODE',
        corporationId: {
          source: Source.query,
          param: 'corporationId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'accountCodeSetEntity/assign',
    method: 'POST',
    authorization: [
      {
        authorizationType: 'forNodeList',
        privilegeName: 'ASSIGN-ACSET-ENTITY',
        hierarchyNodeId: {
          source: Source.body,
          param: 'list.parentHierarchyNodeId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'accountCodeSetEntity/unassign',
    method: 'POST',
    authorization: [
      {
        authorizationType: 'forNodeList',
        privilegeName: 'ASSIGN-ACSET-ENTITY',
        hierarchyNodeId: {
          source: Source.helperService,
          service: 'getNodeIdListForEntityNodeIdList',
          helperArguments: {
            entityNodeIdList: {
              source: Source.body,
              param: 'list.entityNodeId',
            },
          },
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'accountCodeSetEntity',
    method: 'GET',
    authorization: [
      {
        authorizationType: 'externalUserOfCorporation',
        privilegeName: 'VIEW-NODE',
        corporationId: {
          source: Source.query,
          param: 'corporationId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'user/assign',
    method: 'POST',
    authorization: [
      {
        authorizationType: 'forNode',
        privilegeName: 'ASSIGN-USER-ROLE',
        hierarchyNodeId: {
          source: Source.body,
          param: 'parentHierarchyNodeId',
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'workingTelephoneNumber/:wtnNodeId',
    method: 'GET',
    authorization: [
      {
        authorizationType: 'forNode',
        privilegeName: 'VIEW-NODE',
        hierarchyNodeId: {
          source: Source.helperService,
          service: 'getNodeIdForNDEId',
          helperArguments: {
            NDEId: {
              source: Source.path,
              param: 'wtnNodeId',
            },
          },
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'workingTelephoneNumber/:wtnNodeId',
    method: 'DELETE',
    authorization: [
      {
        authorizationType: 'forNode',
        privilegeName: 'MAINTAIN-WTN',
        hierarchyNodeId: {
          source: Source.helperService,
          service: 'getNodeIdForNDEId',
          helperArguments: {
            NDEId: {
              source: Source.path,
              param: 'wtnNodeId',
            },
          },
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'workingTelephoneNumber/:wtnNodeId',
    method: 'PATCH',
    authorization: [
      {
        authorizationType: 'forNode',
        privilegeName: 'MAINTAIN-WTN',
        hierarchyNodeId: {
          source: Source.helperService,
          service: 'getNodeIdForNDEId',
          helperArguments: {
            NDEId: {
              source: Source.path,
              param: 'wtnNodeId',
            },
          },
        },
        disabled: false,
      },
    ],
  },
  {
    path: 'workingTelephoneNumber',
    method: 'GET',
    authorization: [
      {
        authorizationType: 'externalUserOfCorporation',
        privilegeName: 'VIEW-NODE',
        corporationId: {
          source: Source.query,
          param: 'corporationId',
        },
        disabled: false,
      },
    ],
  },
];
