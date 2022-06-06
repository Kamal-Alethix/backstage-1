import { BitbucketCloudIntegrationConfig } from '@backstage/integration';
import { Models } from './models';
import { WithPagination } from './pagination';
import { FilterAndSortOptions, PartialResponseOptions } from './types';
/** @public */
export declare class BitbucketCloudClient {
    private readonly config;
    static fromConfig(config: BitbucketCloudIntegrationConfig): BitbucketCloudClient;
    private constructor();
    searchCode(workspace: string, query: string, options?: FilterAndSortOptions & PartialResponseOptions): WithPagination<Models.SearchResultPage, Models.SearchCodeSearchResult>;
    listRepositoriesByWorkspace(workspace: string, options?: FilterAndSortOptions & PartialResponseOptions): WithPagination<Models.PaginatedRepositories, Models.Repository>;
    private createUrl;
    private getTypeMapped;
    private get;
    private request;
    private getAuthHeaders;
}
