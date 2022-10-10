import { sortableString } from '../../utils/util';
import ResponseDto from '../dto/response.dto';
import BaseEntity from './base.entity';
const transformer = require('json-transformer-node');

export default class HomePageStatisticsEntity extends BaseEntity {
  resultCount: number;
  @sortableString() file: string;
  dtDownloadedPstFmt: string;
  @sortableString() name: string;
  @sortableString() clecProv: string;
  new: number;
  awaitingPreCheck: number;
  awaitingBlifToDirection: number;
  lockedByAutomation: number;
  failedBlifToDirection: number;
  awaitingAckAccepted: number;
  awaitingAckRejected: number;
  totalReceived: number;
  totalProcessed: number;

  static transformer = {
    mapping: {
      item: {
        resultCount: 'RESULT_COUNT',
        file: 'CLEC_FILENAME',
        dtDownloadedPstFmt: 'DT_DOWNLOADED_PST_FMT',
        clecProv: 'CLEC_PROV',
        new: 'NEW',
        awaitingPreCheck: 'AWAITING_PRECHECK',
        awaitingBlifToDirection: 'AWAITING_BLIF_TO_DIRECTION',
        lockedByAutomation: 'LOCKED_BY_AUTOMATION',
        failedBlifToDirection: 'FAILED_BLIF_TO_DIRECTION',
        awaitingAckAccepted: 'AWAITING_ACK_ACCEPTED',
        awaitingAckRejected: 'AWAITING_ACK_REJECTED',
        totalReceived: 'TOTAL_RECEIVED',
        totalProcessed: 'TOTAL_PROCESSED'
      },
    },
  };

  static transformerArray = {
    mapping: {
      item: {
        result: [
          {
            list: 'data',
            item: HomePageStatisticsEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  static transform(json: any): HomePageStatisticsEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, HomePageStatisticsEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }

  static getDbColumnName(columnName: string): any {
    const index = Object.keys(HomePageStatisticsEntity.transformer.mapping.item).findIndex((n1) => n1 == columnName);
    return index > -1 ? Object.values(HomePageStatisticsEntity.transformer.mapping.item)[index] : undefined;
  }
}
