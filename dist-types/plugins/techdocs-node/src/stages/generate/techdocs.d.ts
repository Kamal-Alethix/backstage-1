import { ContainerRunner } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { GeneratorBase, GeneratorConfig, GeneratorOptions, GeneratorRunOptions } from './types';
/**
 * Generates documentation files
 * @public
 */
export declare class TechdocsGenerator implements GeneratorBase {
    /**
     * The default docker image (and version) used to generate content. Public
     * and static so that techdocs-node consumers can use the same version.
     */
    static readonly defaultDockerImage = "spotify/techdocs:v1.0.3";
    private readonly logger;
    private readonly containerRunner;
    private readonly options;
    private readonly scmIntegrations;
    /**
     * Returns a instance of TechDocs generator
     * @param config - A Backstage configuration
     * @param options - Options to configure the generator
     */
    static fromConfig(config: Config, options: GeneratorOptions): TechdocsGenerator;
    constructor(options: {
        logger: Logger;
        containerRunner: ContainerRunner;
        config: Config;
        scmIntegrations: ScmIntegrationRegistry;
    });
    /** {@inheritDoc GeneratorBase.run} */
    run(options: GeneratorRunOptions): Promise<void>;
}
export declare function readGeneratorConfig(config: Config, logger: Logger): GeneratorConfig;
