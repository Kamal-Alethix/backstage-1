import { GraphQLBrowseApi, GraphQLEndpoint } from './types';
import { ErrorApi, OAuthApi } from '@backstage/core-plugin-api';
/**
 * Helper for generic http endpoints
 *
 * @public
 */
export declare type EndpointConfig = {
    id: string;
    title: string;
    url: string;
    method?: 'POST';
    headers?: {
        [name in string]: string;
    };
};
/** @public */
export declare type GithubEndpointConfig = {
    id: string;
    title: string;
    /**
     * GitHub GraphQL API url, defaults to https://api.github.com/graphql
     */
    url?: string;
    /**
     * Errors will be posted to the ErrorApi if it is provided.
     */
    errorApi?: ErrorApi;
    /**
     * GitHub Auth API used to authenticate requests.
     */
    githubAuthApi: OAuthApi;
};
/** @public */
export declare class GraphQLEndpoints implements GraphQLBrowseApi {
    private readonly endpoints;
    static create(config: EndpointConfig): GraphQLEndpoint;
    /**
     * Creates a GitHub GraphQL endpoint that uses the GithubAuth API to authenticate requests.
     *
     * If a request requires more permissions than is granted by the existing session,
     * the fetcher will automatically ask for the additional scopes that are required.
     */
    static github(config: GithubEndpointConfig): GraphQLEndpoint;
    static from(endpoints: GraphQLEndpoint[]): GraphQLEndpoints;
    private constructor();
    getEndpoints(): Promise<GraphQLEndpoint[]>;
}
