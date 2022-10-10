import { BaseDto } from './haa-common.dto';

export default class HomePageStatisticsDto extends BaseDto {
    totalFilteredRows: number;
    file: string;
    dateDownloaded: string;
    newFile: number;
    awaitingPreCheck: number;
    awaitingBlifToDirection: number;
    lockedByAutomation: number;
    failedBlifToDirection: number;
    awaitingAcknowledgementAccepted: number;
    awaitingAcknowledgementRejected: number;
    totalReceived: number;
    totalProcessed: number;
}
