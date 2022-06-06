import { FilterStatusType, TriggerReason } from '../apis/types';
export declare type Averagify<T extends string> = `${T} avg`;
export declare type Countify<T extends string> = `${T} count`;
export declare type Epoch = {
    __epoch: number;
};
export declare type ChartableStageDatapoints = Epoch & {
    [status in FilterStatusType]?: number;
} & {
    [status in Averagify<FilterStatusType>]?: number;
} & {
    [status in Countify<FilterStatusType>]?: number;
};
export interface ChartableStageAnalysis {
    /** Maximum duration */
    max: number;
    /** Minimum duration */
    min: number;
    /** Average duration */
    avg: number;
    /** Median duration */
    med: number;
}
export interface ChartableStage {
    analysis: Record<FilterStatusType, ChartableStageAnalysis>;
    combinedAnalysis: ChartableStageAnalysis;
    name: string;
    values: Array<ChartableStageDatapoints>;
    statusSet: Set<FilterStatusType>;
    stages: Map<string, ChartableStage>;
}
export declare type TriggerReasonsDatapoint = {
    [K in TriggerReason]?: number;
};
export declare type StatusesDatapoint = {
    [status in FilterStatusType]?: number;
};
export declare type ChartableDailyDatapoint = Epoch & TriggerReasonsDatapoint & StatusesDatapoint;
export interface ChartableDaily {
    values: Array<ChartableDailyDatapoint>;
    /**
     * The build trigger reasons
     */
    triggerReasons: Array<string>;
    /**
     * The top-level (build) statuses
     */
    statuses: Array<string>;
}
export interface ChartableStagesAnalysis {
    /**
     * Summary of statuses and trigger reasons per day
     */
    daily: ChartableDaily;
    /**
     * Total aggregates of sub stages
     */
    total: ChartableStage;
    /**
     * Top-level stages {name -> stage}
     */
    stages: Map<string, ChartableStage>;
    /**
     * All statuses found deeper in the stage tree. A stage might have been
     * _aborted_ although the build actually _failed_, e.g.
     */
    statuses: Array<string>;
}
