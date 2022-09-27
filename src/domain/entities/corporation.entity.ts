import ResponseDto from '../dto/response.dto';
import BaseEntity from './base.entity';
const transformer = require('json-transformer-node');

export default class CorporationEntity extends BaseEntity {
  conId: number;
  cosAddress1: string;
  cosAddress2: string;
  cosAddress3: string;
  cosCity: string;
  cosPostalZip: string;
  psnId: number;
  cosName: string;
  cosContactName: string;
  cosContactTitle: string;
  cosContactPhone: string;
  cosContactFax: string;
  cosContactEmail: string;
  cosOrgId: string;
  rcnId: number;

  static transformer = {
    mapping: {
      item: {
        conId: 'CON_ID',
        cosAddress1: 'COS_ADDRESS1',
        cosAddress2: 'COS_ADDRESS2',
        cosAddress3: 'COS_ADDRESS3',
        cosCity: 'COS_CITY',
        cosPostalZip: 'COS_POSTAL_ZIP',
        psnId: 'PSN_ID',
        cosName: 'COS_NAME',
        cosContactName: 'COS_CONTACT_NAME',
        cosContactTitle: 'COS_CONTACT_TITLE',
        cosContactPhone: 'COS_CONTACT_PHONE',
        cosContactFax: 'COS_CONTACT_FAX',
        cosContactEmail: 'COS_CONTACT_EMAIL',
        cosOrgId: 'COS_ORG_ID',
        rcnId: 'RCN_ID',
      },
    },
  };

  static transformerArray = {
    mapping: {
      item: {
        result: [
          {
            list: 'data',
            item: CorporationEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  static transform(json: any): CorporationEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, CorporationEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }
}
