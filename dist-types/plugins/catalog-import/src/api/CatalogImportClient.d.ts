import { CatalogApi } from '@backstage/catalog-client';
import { ConfigApi, DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { ScmAuthApi } from '@backstage/integration-react';
import { AnalyzeResult, CatalogImportApi } from './CatalogImportApi';
/**
 * The default implementation of the {@link CatalogImportApi}.
 *
 * @public
 */
export declare class CatalogImportClient implements CatalogImportApi {
    private readonly discoveryApi;
    private readonly identityApi;
    private readonly scmAuthApi;
    private readonly scmIntegrationsApi;
    private readonly catalogApi;
    private readonly configApi;
    constructor(options: {
        discoveryApi: DiscoveryApi;
        scmAuthApi: ScmAuthApi;
        identityApi: IdentityApi;
        scmIntegrationsApi: ScmIntegrationRegistry;
        catalogApi: CatalogApi;
        configApi: ConfigApi;
    });
    analyzeUrl(url: string): Promise<AnalyzeResult>;
    preparePullRequest(): Promise<{
        title: string;
        body: string;
    }>;
    submitPullRequest(options: {
        repositoryUrl: string;
        fileContent: string;
        title: string;
        body: string;
    }): Promise<{
        link: string;
        location: string;
    }>;
    private generateEntityDefinitions;
    private checkGitHubForExistingCatalogInfo;
    private submitGitHubPrToRepo;
}
