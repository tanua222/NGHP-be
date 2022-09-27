import ResponseDto from '../../../domain/dto/response.dto';
import Context from '../../../utils/context';
import { ErrorMapping } from '../../error-responses-mapping';
import { DatabaseErrorMap, DBErrorCode } from '../db-base-class';

export const HierarchyNodeDBErrorMapping: DatabaseErrorMap[] = [
  {
    errorCode: DBErrorCode.INTEGRITY_CONSTRAINT,
    constraint: [
      {
        constraint: 'HNDE_NTP_FK',
        errorFunction: (context: Context, params: any) => {
          throw ResponseDto.badRequestErrorCode(context, ErrorMapping.IVSHAA4421, {
            parentHierarchyNodeId: params.parentHierarchyNodeId,
          });
        },
      },
    ],
  },
  {
    errorCode: DBErrorCode.UNIQUE_KEY_CONSTRAINT,
    constraint: [
      {
        constraint: 'NDS_UK',
        errorFunction: (context: Context, params: any) => {
          throw ResponseDto.badRequestErrorCode(context, ErrorMapping.IVSHAA4420, {
            name: params.name,
          });
        },
      },
    ],
  },
];
