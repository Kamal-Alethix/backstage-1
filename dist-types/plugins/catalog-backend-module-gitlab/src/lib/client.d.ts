import { GitLabIntegrationConfig } from '@backstage/integration';
import { Logger } from 'winston';
export declare type ListOptions = {
    [key: string]: string | number | boolean | undefined;
    group?: string;
    per_page?: number | undefined;
    page?: number | undefined;
};
export declare type PagedResponse<T> = {
    items: T[];
    nextPage?: number;
};
export declare class GitLabClient {
    private readonly config;
    private readonly logger;
    constructor(options: {
        config: GitLabIntegrationConfig;
        logger: Logger;
    });
    /**
     * Indicates whether the client is for a SaaS or self managed GitLab instance.
     */
    isSelfManaged(): boolean;
    listProjects(options?: ListOptions): Promise<PagedResponse<any>>;
    hasFile(projectPath: string, branch: string, filePath: string): Promise<boolean>;
    /**
     * Performs a request against a given paginated GitLab endpoint.
     *
     * This method may be used to perform authenticated REST calls against any
     * paginated GitLab endpoint which uses X-NEXT-PAGE headers. The return value
     * can be be used with the {@link paginated} async-generator function to yield
     * each item from the paged request.
     *
     * @see {@link paginated}
     * @param endpoint - The request endpoint, e.g. /projects.
     * @param options - Request queryString options which may also include page variables.
     */
    pagedRequest<T = any>(endpoint: string, options?: ListOptions): Promise<PagedResponse<T>>;
}
/**
 * Advances through each page and provides each item from a paginated request.
 *
 * The async generator function yields each item from repeated calls to the
 * provided request function. The generator walks through each available page by
 * setting the page key in the options passed into the request function and
 * making repeated calls until there are no more pages.
 *
 * @see {@link pagedRequest}
 * @param request - Function which returns a PagedResponse to walk through.
 * @param options - Initial ListOptions for the request function.
 */
export declare function paginated<T = any>(request: (options: ListOptions) => Promise<PagedResponse<T>>, options: ListOptions): AsyncGenerator<Awaited<T>, void, unknown>;
