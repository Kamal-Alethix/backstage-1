import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { PreparerBase, PreparerBuilder, PreparerConfig, RemoteProtocol } from './types';
/**
 * Collection of docs preparers (dir and url)
 * @public
 */
export declare class Preparers implements PreparerBuilder {
    private preparerMap;
    /**
     * Returns a generators instance containing a generator for TechDocs
     * @public
     * @param backstageConfig - A Backstage configuration
     * @param preparerConfig - Options to configure preparers
     */
    static fromConfig(backstageConfig: Config, { logger, reader }: PreparerConfig): Promise<PreparerBuilder>;
    /**
     * Register a preparer in the preparers collection
     * @param protocol - url or dir to associate with preparer
     * @param preparer - The preparer instance to set
     */
    register(protocol: RemoteProtocol, preparer: PreparerBase): void;
    /**
     * Returns the preparer for a given TechDocs entity
     * @param entity - A TechDocs entity instance
     * @returns
     */
    get(entity: Entity): PreparerBase;
}
