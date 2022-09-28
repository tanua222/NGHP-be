import { BaseDto } from './haa-common.dto';

export default class HomePageStatisticsDto extends BaseDto {
    totalFilteredRows: string;
    clecFilename: string;
    ediFilename: string;
    dateDownloadedFormattted: string;
    clec: string;
    province: string;
    newFile: string;
    awaitingPrecheck: string;
    awaitingBlifToDirection: string;
    lockedByAutomation: string;
    failedBlifToDirection: string;
    awaitingAcknowledgementAccepted: string;
    awaitingAcknowledgementRejected: string;
    totalReceived: string;
    totalProcessed: string;
}
