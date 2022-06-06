import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { ReaderFactory, UrlReader } from './types';
/**
 * Creation options for {@link UrlReaders}.
 *
 * @public
 */
export declare type UrlReadersOptions = {
    /** Root config object */
    config: Config;
    /** Logger used by all the readers */
    logger: Logger;
    /** A list of factories used to construct individual readers that match on URLs */
    factories?: ReaderFactory[];
};
/**
 * Helps construct {@link UrlReader}s.
 *
 * @public
 */
export declare class UrlReaders {
    /**
     * Creates a custom {@link UrlReader} wrapper for your own set of factories.
     */
    static create(options: UrlReadersOptions): UrlReader;
    /**
     * Creates a {@link UrlReader} wrapper that includes all the default factories
     * from this package.
     *
     * Any additional factories passed will be loaded before the default ones.
     */
    static default(options: UrlReadersOptions): UrlReader;
}
