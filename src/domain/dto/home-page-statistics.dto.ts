import { BaseDto } from './haa-common.dto';

export default class HomePageStatisticsDto extends BaseDto {
    totalFilteredRows: number;
    clecFilename: string;
    ediFilename: string;
    dateDownloadedFormattted: string;
    clec: string;
    province: string;
    newFile: number;
    awaitingPrecheck: number;
    awaitingBlifToDirection: number;
    lockedByAutomation: number;
    failedBlifToDirection: number;
    awaitingAcknowledgementAccepted: number;
    awaitingAcknowledgementRejected: number;
    totalReceived: number;
    totalProcessed: number;
}
