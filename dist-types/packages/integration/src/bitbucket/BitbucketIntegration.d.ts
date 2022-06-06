import { ScmIntegration, ScmIntegrationsFactory } from '../types';
import { BitbucketIntegrationConfig } from './config';
/**
 * A Bitbucket based integration.
 *
 * @public
 * @deprecated replaced by the integrations bitbucketCloud and bitbucketServer.
 */
export declare class BitbucketIntegration implements ScmIntegration {
    private readonly integrationConfig;
    static factory: ScmIntegrationsFactory<BitbucketIntegration>;
    constructor(integrationConfig: BitbucketIntegrationConfig);
    get type(): string;
    get title(): string;
    get config(): BitbucketIntegrationConfig;
    resolveUrl(options: {
        url: string;
        base: string;
        lineNumber?: number;
    }): string;
    resolveEditUrl(url: string): string;
}
