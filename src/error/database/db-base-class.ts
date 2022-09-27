import Context from '../../utils/context';

export class DatabaseErrorMap {
  errorCode: string;
  constraint: Constraint[];
}

export class Constraint {
  constraint: string;
  errorFunction: (context: Context, params: any) => void;
}

export enum DBErrorCode {
  UNIQUE_KEY_CONSTRAINT = '00001',
  INTEGRITY_CONSTRAINT = '02291',
  CHECK_CONSTRAINT = '02290',
}
