/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { ErrorApi, OAuthApi, IconComponent } from '@backstage/core-plugin-api';

/** @public */
declare const graphiqlPlugin: _backstage_core_plugin_api.BackstagePlugin<{}, {}>;
/** @public */
declare const GraphiQLPage$1: () => JSX.Element;

/** @public */
declare const GraphiQLPage: () => JSX.Element;

/** @public */
declare type GraphQLEndpoint = {
    id: string;
    title: string;
    fetcher: (body: any) => Promise<any>;
};
/** @public */
declare type GraphQLBrowseApi = {
    getEndpoints(): Promise<GraphQLEndpoint[]>;
};
/** @public */
declare const graphQlBrowseApiRef: _backstage_core_plugin_api.ApiRef<GraphQLBrowseApi>;

/**
 * Helper for generic http endpoints
 *
 * @public
 */
declare type EndpointConfig = {
    id: string;
    title: string;
    url: string;
    method?: 'POST';
    headers?: {
        [name in string]: string;
    };
};
/** @public */
declare type GithubEndpointConfig = {
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
declare class GraphQLEndpoints implements GraphQLBrowseApi {
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

/** @public */
declare const graphiQLRouteRef: _backstage_core_plugin_api.RouteRef<undefined>;

/** @public */
declare const GraphiQLIcon: IconComponent;

export { EndpointConfig, GithubEndpointConfig, GraphQLBrowseApi, GraphQLEndpoint, GraphQLEndpoints, GraphiQLIcon, GraphiQLPage$1 as GraphiQLPage, GraphiQLPage as Router, graphQlBrowseApiRef, graphiQLRouteRef, graphiqlPlugin, graphiqlPlugin as plugin };
