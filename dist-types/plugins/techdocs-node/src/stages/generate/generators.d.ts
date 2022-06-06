import { ContainerRunner } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { GeneratorBase, GeneratorBuilder, SupportedGeneratorKey } from './types';
/**
 * Collection of docs generators
 * @public
 */
export declare class Generators implements GeneratorBuilder {
    private generatorMap;
    /**
     * Returns a generators instance containing a generator for TechDocs
     * @param config - A Backstage configuration
     * @param options - Options to configure the TechDocs generator
     */
    static fromConfig(config: Config, options: {
        logger: Logger;
        containerRunner: ContainerRunner;
    }): Promise<GeneratorBuilder>;
    /**
     * Register a generator in the generators collection
     * @param generatorKey - Unique identifier for the generator
     * @param generator - The generator instance to register
     */
    register(generatorKey: SupportedGeneratorKey, generator: GeneratorBase): void;
    /**
     * Returns the generator for a given TechDocs entity
     * @param entity - A TechDocs entity instance
     */
    get(entity: Entity): GeneratorBase;
}
