import { ChartableStage } from '../types';
export declare function average(values: number[]): number;
export declare function getOrSetStage(stages: Map<string, ChartableStage>, name: string): ChartableStage;
export declare function makeStage(name: string): ChartableStage;
export declare function startOfDay(date: number | Date): number;
export declare function sortTriggerReasons(reasons: Array<string>): Array<string>;
export declare function sortStatuses(statuses: Array<string>): Array<string>;
