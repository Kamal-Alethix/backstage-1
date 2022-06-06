import { ScmIntegration, ScmIntegrationsFactory } from '../types';
import { AzureIntegrationConfig } from './config';
/**
 * Microsoft Azure based integration.
 *
 * @public
 */
export declare class AzureIntegration implements ScmIntegration {
    private readonly integrationConfig;
    static factory: ScmIntegrationsFactory<AzureIntegration>;
    constructor(integrationConfig: AzureIntegrationConfig);
    get type(): string;
    get title(): string;
    get config(): AzureIntegrationConfig;
    resolveUrl(options: {
        url: string;
        base: string;
        lineNumber?: number;
    }): string;
    resolveEditUrl(url: string): string;
}
