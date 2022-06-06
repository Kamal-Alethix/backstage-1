import { Build } from '../../apis/types';
import { ChartableStagesAnalysis } from '../types';
export interface ChartableStagesOptions {
    normalizeTimeRange: boolean;
}
/**
 * Converts a list of builds, each with a tree of stages (and durations) into a
 * merged tree of stages, and calculates {avg, min, max} of each stage.
 */
export declare function buildsToChartableStages(builds: Array<Build>, options: ChartableStagesOptions): Promise<ChartableStagesAnalysis>;
