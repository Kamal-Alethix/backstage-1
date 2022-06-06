import { ScmIntegration, ScmIntegrationsFactory } from '../types';
import { BitbucketServerIntegrationConfig } from './config';
/**
 * A Bitbucket Server based integration.
 *
 * @public
 */
export declare class BitbucketServerIntegration implements ScmIntegration {
    private readonly integrationConfig;
    static factory: ScmIntegrationsFactory<BitbucketServerIntegration>;
    constructor(integrationConfig: BitbucketServerIntegrationConfig);
    get type(): string;
    get title(): string;
    get config(): BitbucketServerIntegrationConfig;
    resolveUrl(options: {
        url: string;
        base: string;
        lineNumber?: number;
    }): string;
    resolveEditUrl(url: string): string;
}
