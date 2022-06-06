import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { SearchApi } from '@backstage/plugin-search-react';
import { SearchQuery, SearchResultSet } from '@backstage/plugin-search-common';
export declare class SearchClient implements SearchApi {
    private readonly discoveryApi;
    private readonly identityApi;
    constructor(options: {
        discoveryApi: DiscoveryApi;
        identityApi: IdentityApi;
    });
    query(query: SearchQuery): Promise<SearchResultSet>;
}
