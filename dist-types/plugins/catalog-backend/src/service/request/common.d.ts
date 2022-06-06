/**
 * Takes a single unknown parameter and makes sure that it's a string that can
 * be parsed as an integer.
 */
export declare function parseIntegerParam(param: unknown, ctx: string): number | undefined;
/**
 * Takes a single unknown parameter and makes sure that it's a string.
 */
export declare function parseStringParam(param: unknown, ctx: string): string | undefined;
/**
 * Takes a single unknown parameter and makes sure that it's a single string or
 * an array of strings, and returns as an array.
 */
export declare function parseStringsParam(param: unknown, ctx: string): string[] | undefined;
