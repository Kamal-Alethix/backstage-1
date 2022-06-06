/**
 * Function that returns the catalog processing interval in seconds.
 * @public
 */
export declare type ProcessingIntervalFunction = () => number;
/**
 * Creates a function that returns a random processing interval between minSeconds and maxSeconds.
 * @returns A {@link ProcessingIntervalFunction} that provides the next processing interval
 * @public
 */
export declare function createRandomProcessingInterval(options: {
    minSeconds: number;
    maxSeconds: number;
}): ProcessingIntervalFunction;
