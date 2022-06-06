import { ChartableStage } from '../types';
interface FinalizeStageOptions {
    averageWidth: number;
    allEpochs: Array<number>;
}
/**
 * Calculate:
 *   * {avg, min, max}
 *   * count per day
 * of a stage and its sub stages, recursively.
 *
 * This is calculated per status (successful, failed, etc).
 */
export declare function finalizeStage(stage: ChartableStage, options: FinalizeStageOptions): void;
export {};
