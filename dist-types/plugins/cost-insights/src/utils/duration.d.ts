import { Duration } from '../types';
export declare const DEFAULT_DURATION = Duration.P30D;
/**
 * Derive the start date of a given period, assuming two repeating intervals.
 *
 * @param duration - see comment on Duration enum
 * @param inclusiveEndDate - from CostInsightsApi.getLastCompleteBillingDate
 */
export declare function inclusiveStartDateOf(duration: Duration, inclusiveEndDate: string): string;
export declare function exclusiveEndDateOf(duration: Duration, inclusiveEndDate: string): string;
export declare function inclusiveEndDateOf(duration: Duration, inclusiveEndDate: string): string;
export declare function intervalsOf(duration: Duration, inclusiveEndDate: string, repeating?: number): string;
export declare function quarterEndDate(inclusiveEndDate: string): string;
