import HomePageStatisticsDto from '../dto/home-page-statistics.dto';
import HomePageStatisticsEntity from '../entities/home-page-statistics.entity';
import { SortParam } from '../dto/haa-common.dto';

export class HomePageStatisticsMap {

    static dtoFieldToEntityFieldMapping: any = {
        clecFilename: 'clecFilename',
        ediFilename: 'ediFilename',
        dateDownloadedFormattted: 'dtDownloadedPstFmt',
        clec: 'name',
        province: 'clecProv',
        newFile: 'new',
        awaitingPrecheck: 'awaitingPrecheck',
        awaitingBlifToDirection: 'awaitingBlifToDirection',
        lockedByAutomation: 'lockedByAutomation',
        failedBlifToDirection: 'failedBlifToDirection',
        awaitingAcknowledgementAccepted: 'awaitingAckAccepted',
        awaitingAcknowledgementRejected: 'awaitingAckRejected',
        totalReceived: 'totalReceived',
        totalProcessed: 'totalProcessed',
        totalFilteredRows: 'resultCount'
    };

    static entityToDto(entities: HomePageStatisticsEntity[]): HomePageStatisticsDto[] {
        const dtos = entities.map((entity) => {
            const dto = new HomePageStatisticsDto();
            dto.totalFilteredRows = entity.resultCount;
            dto.clecFilename = entity.clecFilename;
            dto.ediFilename = entity.ediFilename;
            dto.dateDownloadedFormattted = entity.dtDownloadedPstFmt;
            dto.clec = entity.name;
            dto.province = entity.clecProv;
            dto.newFile = entity.new;
            dto.awaitingPrecheck = entity.awaitingPrecheck;
            dto.awaitingBlifToDirection = entity.awaitingBlifToDirection;
            dto.lockedByAutomation = entity.lockedByAutomation;
            dto.failedBlifToDirection = entity.failedBlifToDirection;
            dto.awaitingAcknowledgementAccepted = entity.awaitingAckAccepted;
            dto.awaitingAcknowledgementRejected = entity.awaitingAckRejected;
            dto.totalReceived = entity.totalReceived;
            dto.totalProcessed = entity.totalProcessed;
            return dto;
        });
        return dtos;
    }

    static mapDtoToEntitySortParams(sortParams: SortParam[]): SortParam[] {
        if (!sortParams.length) {
            sortParams = this.getDefaultSortParam();
        }
        const sortParamss: any[] = [];
        for (const sortParam of sortParams) {
            const entityField = this.dtoFieldToEntityFieldMapping[sortParam.fieldName];
            if (entityField) {
                sortParamss.push({ ...sortParam, fieldName: entityField });
            }
        }
        return sortParamss;
    }

    static getDefaultSortParam(): SortParam[] {
        return [
            {
                fieldName: 'dateDownloadedFormattted',
                asc: false,
            },
        ];
    }

}
