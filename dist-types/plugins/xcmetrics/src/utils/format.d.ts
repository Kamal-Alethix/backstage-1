import { BuildStatus } from '../api';
export declare const formatDuration: (seconds: number) => string;
export declare const formatSecondsInterval: ([start, end]: [number, number]) => string;
export declare const formatTime: (timestamp: string) => string;
export declare const formatPercentage: (number: number) => string;
export declare const formatStatus: (status: BuildStatus) => string;
