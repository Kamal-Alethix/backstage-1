import { ScmIntegration, ScmIntegrationsFactory } from '../types';
import { BitbucketCloudIntegrationConfig } from './config';
/**
 * A Bitbucket Cloud based integration.
 *
 * @public
 */
export declare class BitbucketCloudIntegration implements ScmIntegration {
    private readonly integrationConfig;
    static factory: ScmIntegrationsFactory<BitbucketCloudIntegration>;
    constructor(integrationConfig: BitbucketCloudIntegrationConfig);
    get type(): string;
    get title(): string;
    get config(): BitbucketCloudIntegrationConfig;
    resolveUrl(options: {
        url: string;
        base: string;
        lineNumber?: number;
    }): string;
    resolveEditUrl(url: string): string;
}
