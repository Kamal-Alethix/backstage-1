import { DateTime } from 'luxon';
/**
 * Takes a TIMESTAMP type column and converts it to a DateTime.
 *
 * Some engines return the SQL string form (e.g. 'YYYY-MM-DD hh:mm:ss'), some
 * return ISO string form (e.g. 'YYYY-MM-DDThh:mm:ss.SSSZ'), some return a js
 * Date object.
 */
export declare function timestampToDateTime(input: Date | string): DateTime;
/**
 * Rethrows an error, possibly translating it to a more precise error type.
 */
export declare function rethrowError(e: any): never;
