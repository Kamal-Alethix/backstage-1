import { Config } from '@backstage/config';
import { BitbucketIntegration, ScmIntegrationRegistry } from '@backstage/integration';
import { CatalogProcessorResult, CatalogProcessor, LocationSpec, CatalogProcessorEmit } from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';

/**
 * A custom callback that reacts to finding a repository by yielding processing
 * results.
 *
 * @public
 */
declare type BitbucketRepositoryParser = (options: {
    integration: BitbucketIntegration;
    target: string;
    presence?: 'optional' | 'required';
    logger: Logger;
}) => AsyncIterable<CatalogProcessorResult>;

/** @public */
declare class BitbucketDiscoveryProcessor implements CatalogProcessor {
    private readonly integrations;
    private readonly parser;
    private readonly logger;
    static fromConfig(config: Config, options: {
        parser?: BitbucketRepositoryParser;
        logger: Logger;
    }): BitbucketDiscoveryProcessor;
    constructor(options: {
        integrations: ScmIntegrationRegistry;
        parser?: BitbucketRepositoryParser;
        logger: Logger;
    });
    getProcessorName(): string;
    readLocation(location: LocationSpec, _optional: boolean, emit: CatalogProcessorEmit): Promise<boolean>;
    private processCloudRepositories;
    private processOrganizationRepositories;
}

export { BitbucketDiscoveryProcessor, BitbucketRepositoryParser };
