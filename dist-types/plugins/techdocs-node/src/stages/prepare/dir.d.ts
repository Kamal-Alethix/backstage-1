import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { PreparerBase, PreparerConfig, PreparerOptions, PreparerResponse } from './types';
/**
 * Preparer used to retrieve documentation files from a local directory
 * @public
 */
export declare class DirectoryPreparer implements PreparerBase {
    private readonly scmIntegrations;
    private readonly reader;
    /**
     * Returns a directory preparer instance
     * @param config - A backstage config
     * @param options - A directory preparer options containing a logger and reader
     */
    static fromConfig(config: Config, { logger, reader }: PreparerConfig): DirectoryPreparer;
    private constructor();
    /** {@inheritDoc PreparerBase.prepare} */
    prepare(entity: Entity, options?: PreparerOptions): Promise<PreparerResponse>;
}
