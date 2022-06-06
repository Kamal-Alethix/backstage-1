import { BitbucketIntegrationConfig } from '@backstage/integration';
export declare class BitbucketServerClient {
    private readonly config;
    constructor(options: {
        config: BitbucketIntegrationConfig;
    });
    listProjects(options?: ListOptions): Promise<PagedResponse<any>>;
    listRepositories(projectKey: string, options?: ListOptions): Promise<PagedResponse<any>>;
    private pagedRequest;
}
export declare type ListOptions = {
    [key: string]: number | undefined;
    limit?: number | undefined;
    start?: number | undefined;
};
export declare type PagedResponse<T> = {
    size: number;
    limit: number;
    start: number;
    isLastPage: boolean;
    values: T[];
    nextPageStart: number;
};
export declare function paginated(request: (options: ListOptions) => Promise<PagedResponse<any>>, options?: ListOptions): AsyncGenerator<any, void, unknown>;
