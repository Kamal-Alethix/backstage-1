import { BuildCount, BuildTime } from '../api';
export declare const getErrorRatios: (buildCounts?: BuildCount[] | undefined) => number[] | undefined;
export declare const getAverageDuration: (buildTimes: BuildTime[] | undefined, field: (b: BuildTime) => number) => string | undefined;
