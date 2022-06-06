/**
 * Time periods for cost comparison; slight abuse of ISO 8601 periods. We take P3M to mean
 * 'last completed quarter', and P30D/P90D to be '[month|quarter] relative to today'. So if
 * it's September 15, P3M represents costs for Q2 and P30D represents August 16 -
 * September 15.
 */
export declare enum Duration {
    P7D = "P7D",
    P30D = "P30D",
    P90D = "P90D",
    P3M = "P3M"
}
export declare const DEFAULT_DATE_FORMAT = "yyyy-LL-dd";
