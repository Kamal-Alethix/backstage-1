import { FilterStatusType } from '../../apis/types';
import { ChartableStageAnalysis, ChartableStageDatapoints } from '../types';
export declare function getAnalysis(values: Array<ChartableStageDatapoints>, status: FilterStatusType): ChartableStageAnalysis;
export declare function makeCombinedAnalysis(analysis: Record<FilterStatusType, ChartableStageAnalysis>, allDurations: Array<number>): ChartableStageAnalysis;
