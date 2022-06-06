import { ScmIntegration, ScmIntegrationsFactory } from '../types';
import { AwsS3IntegrationConfig } from './config';
/**
 * Integrates with AWS S3 or compatible solutions.
 *
 * @public
 */
export declare class AwsS3Integration implements ScmIntegration {
    private readonly integrationConfig;
    static factory: ScmIntegrationsFactory<AwsS3Integration>;
    get type(): string;
    get title(): string;
    get config(): AwsS3IntegrationConfig;
    constructor(integrationConfig: AwsS3IntegrationConfig);
    resolveUrl(options: {
        url: string;
        base: string;
        lineNumber?: number | undefined;
    }): string;
    resolveEditUrl(url: string): string;
}
