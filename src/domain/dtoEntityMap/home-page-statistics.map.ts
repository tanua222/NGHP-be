import HomePageStatisticsDto from '../dto/home-page-statistics.dto';
import HomePageStatisticsEntity from '../entities/home-page-statistics.entity';
import { SortParam } from '../dto/haa-common.dto';

export class HomePageStatisticsMap {

    static dtoFieldToEntityFieldMapping: any = {
        ediFilename: 'ediFilename',
        dtDownloaded: 'dtDownloaded',
        dtDownloadedPstFmt: 'dtDownloadedPstFmt',
        name: 'name',
        clecProv: 'clecProv',
        new: 'new',
        awaitingPrecheck: 'awaitingPrecheck',
        awaitingBlifToDirection: 'awaitingBlifToDirection',
        lockedByAutomation: 'lockedByAutomation',
        failedBlifToDirection: 'failedBlifToDirection',
        awaitingAckAccepted: 'awaitingAckAccepted',
        awaitingAckRejected: 'awaitingAckRejected',
        totalReceived: 'totalReceived',
        totalProcessed: 'totalProcessed'
    };

    static entityToDto(entities: HomePageStatisticsEntity[]): HomePageStatisticsDto[] {
        const dtos = entities.map((entity) => {
            const dto = new HomePageStatisticsDto();
            dto.rn = entity.rn;
            dto.resultCount = entity.resultCount;
            dto.clecFilename = entity.clecFilename;
            dto.ediFilename = entity.ediFilename;
            dto.dtDownloaded = entity.dtDownloaded;
            dto.dtDownloadedPstFmt = entity.dtDownloadedPstFmt;
            dto.name = entity.name;
            dto.clecProv = entity.clecProv;
            dto.new = entity.new;
            dto.awaitingPrecheck = entity.awaitingPrecheck;
            dto.awaitingBlifToDirection = entity.awaitingBlifToDirection;
            dto.lockedByAutomation = entity.lockedByAutomation;
            dto.failedBlifToDirection = entity.failedBlifToDirection;
            dto.awaitingAckAccepted = entity.awaitingAckAccepted;
            dto.awaitingAckRejected = entity.awaitingAckRejected;
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
                fieldName: 'ediFilename',
                asc: false,
            },
        ];
    }

}
