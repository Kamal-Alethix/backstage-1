import { Config } from '@backstage/config';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { BitbucketCloudClient, Models } from '@backstage/plugin-bitbucket-cloud-common';
import { CatalogProcessor, CatalogProcessorEmit, LocationSpec } from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
import { BitbucketRepository, BitbucketRepositoryParser, BitbucketServerClient } from './lib';
/** @public */
export declare class BitbucketDiscoveryProcessor implements CatalogProcessor {
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
export declare function readBitbucketOrg(client: BitbucketServerClient, target: string): Promise<Result<BitbucketRepository>>;
export declare function searchBitbucketCloudLocations(client: BitbucketCloudClient, target: string): Promise<Result<string>>;
export declare function readBitbucketCloudLocations(client: BitbucketCloudClient, target: string): Promise<Result<string>>;
export declare function readBitbucketCloud(client: BitbucketCloudClient, target: string): Promise<Result<Models.Repository>>;
declare type Result<T> = {
    scanned: number;
    matches: T[];
};
export {};
