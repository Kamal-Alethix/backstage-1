import { ScmIntegration, ScmIntegrationsFactory } from '../types';
import { GerritIntegrationConfig } from './config';
/**
 * A Gerrit based integration.
 *
 * @public
 */
export declare class GerritIntegration implements ScmIntegration {
    private readonly integrationConfig;
    static factory: ScmIntegrationsFactory<GerritIntegration>;
    constructor(integrationConfig: GerritIntegrationConfig);
    get type(): string;
    get title(): string;
    get config(): GerritIntegrationConfig;
    resolveUrl(options: {
        url: string;
        base: string;
        lineNumber?: number;
    }): string;
    resolveEditUrl(url: string): string;
}
