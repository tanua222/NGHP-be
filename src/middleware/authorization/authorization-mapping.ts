import { Request } from 'express';
import { AuthorizationMappingDefinition, Source } from './authorization-mapping-types';

export const AuthorizationMapping: AuthorizationMappingDefinition[] = [
  {
    path: 'tollFreeNumberEntity',
    method: 'GET',
    authorization: [
      {
        authorizationType: {
          source: Source.function,
          fn: (req: Request) => (req.query.corporationId === undefined ? 'forbidden' : 'forCorporation'),
        },
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
        authorizationType: 'forCorporation',
        privilegeName: 'ASSIGN-TF-ENTITY',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForEntityNodeIdList',
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
        authorizationType: 'forCorporation',
        privilegeName: 'ASSIGN-TF-ENTITY',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForHierarchyNodeIdList',
          helperArguments: {
            hierarchyNodeIdList: {
              source: Source.body,
              param: 'list.parentHierarchyNodeId',
            },
          },
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
        authorizationType: 'forCorporation',
        privilegeName: 'VIEW-NODE',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForHierarchyNodeId',
          helperArguments: {
            hierarchyNodeId: {
              source: Source.query,
              param: 'parentHierarchyNodeId',
            },
          },
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
        authorizationType: 'forCorporation',
        privilegeName: 'VIEW-NODE',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForHierarchyNodeId',
          helperArguments: {
            hierarchyNodeId: {
              source: Source.query,
              param: 'parentHierarchyNodeId',
            },
          },
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
        authorizationType: 'forCorporation',
        privilegeName: 'ASSIGN-ICSET-ENTITY',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForEntityNodeIdList',
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
        authorizationType: 'forCorporation',
        privilegeName: 'ASSIGN-ICSET-ENTITY',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForHierarchyNodeIdList',
          helperArguments: {
            hierarchyNodeIdList: {
              source: Source.body,
              param: 'list.parentHierarchyNodeId',
            },
          },
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
        authorizationType: 'forCorporation',
        privilegeName: 'MAINTAIN-WTN',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForHierarchyNodeId',
          helperArguments: {
            hierarchyNodeId: {
              source: Source.body,
              param: 'parentHierarchyNodeId',
            },
          },
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
        authorizationType: 'forCorporation',
        privilegeName: 'MAINTAIN-NODE',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForHierarchyNodeId',
          helperArguments: {
            hierarchyNodeId: {
              source: Source.body,
              param: 'parentHierarchyNodeId',
            },
          },
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
        authorizationType: 'forCorporation',
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
        authorizationType: 'forCorporation',
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
        authorizationType: 'forCorporation',
        privilegeName: 'VIEW-NODE',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForHierarchyNodeId',
          helperArguments: {
            hierarchyNodeId: {
              source: Source.query,
              param: 'parentHierarchyNodeId',
            },
          },
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
        authorizationType: 'forCorporation',
        privilegeName: 'ASSIGN-USER-ROLE',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForHierarchyNodeIdList',
          helperArguments: {
            hierarchyNodeIdList: {
              source: Source.body,
              param: 'list.parentHierarchyNodeId',
            },
          },
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
        authorizationType: 'forCorporation',
        privilegeName: 'VIEW-NODE',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForHierarchyNodeId',
          helperArguments: {
            hierarchyNodeId: {
              source: Source.query,
              param: 'parentHierarchyNodeId',
            },
          },
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
        authorizationType: 'forCorporation',
        privilegeName: 'VIEW-NODE',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForHierarchyNodeId',
          helperArguments: {
            hierarchyNodeId: {
              source: Source.query,
              param: 'parentHierarchyNodeId',
            },
          },
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
        authorizationType: {
          source: Source.function,
          fn: (req: Request) => (req.query.corporationId === undefined ? 'forbidden' : 'forCorporation'),
        },
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
        authorizationType: 'forCorporation',
        privilegeName: 'ASSIGN-USER-ROLE',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForHierarchyNodeId',
          helperArguments: {
            hierarchyNodeId: {
              source: Source.body,
              param: 'parentHierarchyNodeId',
            },
          },
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
        authorizationType: 'forCorporation',
        privilegeName: 'VIEW-NODE',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForHierarchyNodeId',
          helperArguments: {
            hierarchyNodeId: {
              source: Source.query,
              param: 'hierarchyNodeId',
            },
          },
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
        authorizationType: 'forCorporation',
        privilegeName: 'VIEW-NODE',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForNDEId',
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
        authorizationType: 'forCorporation',
        privilegeName: 'MAINTAIN-NODE',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForNDEId',
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
        authorizationType: 'forCorporation',
        privilegeName: 'MAINTAIN-NODE',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForNDEId',
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
        authorizationType: 'forCorporation',
        privilegeName: 'MOVE-NODE',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForHierarchyNodeId',
          helperArguments: {
            hierarchyNodeId: {
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
        authorizationType: 'forCorporation',
        privilegeName: 'MOVE-WTN',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForHierarchyNodeId',
          helperArguments: {
            hierarchyNodeId: {
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
        authorizationType: {
          source: Source.function,
          fn: (req: Request) => (req.query.corporationId === undefined ? 'forbidden' : 'forCorporation'),
        },
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
        authorizationType: 'forCorporation',
        privilegeName: 'VIEW-NODE',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForHierarchyNodeId',
          helperArguments: {
            hierarchyNodeId: {
              source: Source.query,
              param: 'parentHierarchyNodeId',
            },
          },
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
        authorizationType: 'forCorporation',
        privilegeName: 'ASSIGN-REPORT',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForAssignedReportIdList',
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
        authorizationType: 'forCorporation',
        privilegeName: 'ASSIGN-REPORT',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForAssignedReportIdList',
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
        authorizationType: 'forCorporation',
        privilegeName: 'VIEW-NODE',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForAssignedReportId',
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
        authorizationType: 'forCorporation',
        privilegeName: 'ASSIGN-REPORT',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForAssignedReportId',
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
        authorizationType: 'forCorporation',
        privilegeName: 'ASSIGN-REPORT',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForHierarchyNodeId',
          helperArguments: {
            hierarchyNodeId: {
              source: Source.body,
              param: 'parentHierarchyNodeId',
            },
          },
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
        authorizationType: {
          source: Source.function,
          fn: (req: Request) => (req.query.corporationId === undefined ? 'forbidden' : 'forCorporation'),
        },
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
        authorizationType: 'forCorporation',
        privilegeName: 'ASSIGN-ACSET-ENTITY',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForHierarchyNodeIdList',
          helperArguments: {
            hierarchyNodeIdList: {
              source: Source.body,
              param: 'list.parentHierarchyNodeId',
            },
          },
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
        authorizationType: 'forCorporation',
        privilegeName: 'ASSIGN-ACSET-ENTITY',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForEntityNodeIdList',
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
        authorizationType: {
          source: Source.function,
          fn: (req: Request) => (req.query.corporationId === undefined ? 'forbidden' : 'forCorporation'),
        },
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
        authorizationType: 'forCorporation',
        privilegeName: 'ASSIGN-USER-ROLE',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForHierarchyNodeId',
          helperArguments: {
            hierarchyNodeId: {
              source: Source.body,
              param: 'parentHierarchyNodeId',
            },
          },
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
        authorizationType: 'forCorporation',
        privilegeName: 'VIEW-NODE',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForNDEId',
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
        authorizationType: 'forCorporation',
        privilegeName: 'MAINTAIN-WTN',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForNDEId',
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
        authorizationType: 'forCorporation',
        privilegeName: 'MAINTAIN-WTN',
        corporationId: {
          source: Source.helperService,
          service: 'getCorporationIdForNDEId',
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
        authorizationType: {
          source: Source.function,
          fn: (req: Request) => (req.query.corporationId === undefined ? 'forbidden' : 'forCorporation'),
        },
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
