import { Entity } from '@backstage/catalog-model';
import { CicdState, FilterStatusType, FilterBranchType } from '../apis';
import { ProgressType } from '../components/progress';
export interface UseCicdStatisticsOptions {
    entity: Entity;
    abortController: AbortController;
    timeFrom: Date;
    timeTo: Date;
    filterStatus: Array<FilterStatusType | 'all'>;
    filterType: FilterBranchType | 'all';
}
export declare function useCicdStatistics(options: UseCicdStatisticsOptions): ProgressType<CicdState>;
