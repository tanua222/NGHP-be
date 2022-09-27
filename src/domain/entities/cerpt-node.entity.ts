import ResponseDto from '../dto/response.dto';
import BaseEntity from './base.entity';
import { sortableString } from '../../utils/util';

const transformer = require('json-transformer-node');

export default class CerptNodeEntity extends BaseEntity {
  id: string;
  @sortableString() name: string;
  @sortableString() description1: string | null;
  description2: string | null;
  description3: string | null;
  nodeType: string;
  billingTelephoneNumber: string;
  reportingFlag: string;
  effectiveDate: string;
  wtn: string | null;
  wtnType: string | null;
  excludeFromReportsFlag: string;
  corpId: string;

  static transformer = {
    mapping: {
      item: {
        id: 'ID',
        name: 'NAME',
        description1: 'DESCRIPTION1',
        description2: 'DESCRIPTION2',
        description3: 'DESCRIPTION3',
        nodeType: 'NODE_TYPE',
        billingTelephoneNumber: 'BILLING_TELEPHONE_NUMBER',
        reportingFlag: 'EXCLUDE_FROM_REPORTS_FLAG',
        effectiveDate: 'EFFECTIVE_DATE',
        wtn: 'WTN',
        wtnType: 'WTN_TYPE',
        excludeFromReportsFlag: 'EXCLUDE_FROM_REPORTS_FLAG',
        corpId: 'CORP_ID',
      },
    },
  };

  static transformerArray = {
    mapping: {
      item: {
        result: [
          {
            list: 'data',
            item: CerptNodeEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  static transform(json: any): CerptNodeEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, CerptNodeEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }
}
