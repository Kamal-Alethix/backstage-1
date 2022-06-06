import { Entity } from '@backstage/catalog-model';
import { PreparerBase, PreparerConfig, PreparerOptions, PreparerResponse } from './types';
/**
 * Preparer used to retrieve documentation files from a remote repository
 * @public
 */
export declare class UrlPreparer implements PreparerBase {
    private readonly logger;
    private readonly reader;
    /**
     * Returns a directory preparer instance
     * @param config - A URL preparer config containing the a logger and reader
     */
    static fromConfig({ reader, logger }: PreparerConfig): UrlPreparer;
    private constructor();
    /** {@inheritDoc PreparerBase.prepare} */
    prepare(entity: Entity, options?: PreparerOptions): Promise<PreparerResponse>;
}
