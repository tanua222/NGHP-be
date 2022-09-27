import { BaseDto } from './haa-common.dto';

export default class HomePageStatisticsDto extends BaseDto {
    rn: string;
    resultCount: string;
    clecFilename: string;
    ediFilename: string;
    dtDownloaded: string;
    dtDownloadedPstFmt: string;
    name: string;
    clecProv: string;
    new: string;
    awaitingPrecheck: string;
    awaitingBlifToDirection: string;
    lockedByAutomation: string;
    failedBlifToDirection: string;
    awaitingAckAccepted: string;
    awaitingAckRejected: string;
    totalReceived: string;
    totalProcessed: string;
  // TODO: change if you change entity?
}
