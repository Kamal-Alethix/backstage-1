/** @public */
export declare type GraphQLEndpoint = {
    id: string;
    title: string;
    fetcher: (body: any) => Promise<any>;
};
/** @public */
export declare type GraphQLBrowseApi = {
    getEndpoints(): Promise<GraphQLEndpoint[]>;
};
/** @public */
export declare const graphQlBrowseApiRef: import("@backstage/core-plugin-api").ApiRef<GraphQLBrowseApi>;
