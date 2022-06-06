import * as msal from '@azure/msal-node';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { Response } from 'node-fetch';
import { MicrosoftGraphProviderConfig } from './config';
/**
 * OData (Open Data Protocol) Query
 *
 * {@link https://docs.microsoft.com/en-us/odata/concepts/queryoptions-overview}
 * {@link https://docs.microsoft.com/en-us/graph/query-parameters}
 * @public
 */
export declare type ODataQuery = {
    /**
     * search resources within a collection matching a free-text search expression.
     */
    search?: string;
    /**
     * filter a collection of resources
     */
    filter?: string;
    /**
     * specifies the related resources or media streams to be included in line with retrieved resources
     */
    expand?: string;
    /**
     * request a specific set of properties for each entity or complex type
     */
    select?: string[];
    /**
     * Retrieves the total count of matching resources.
     */
    count?: boolean;
};
/**
 * Extends the base msgraph types to include the odata type.
 *
 * @public
 */
export declare type GroupMember = (MicrosoftGraph.Group & {
    '@odata.type': '#microsoft.graph.user';
}) | (MicrosoftGraph.User & {
    '@odata.type': '#microsoft.graph.group';
});
/**
 * A HTTP Client that communicates with Microsoft Graph API.
 * Simplify Authentication and API calls to get `User` and `Group` from Azure Active Directory
 *
 * Uses `msal-node` for authentication
 *
 * @public
 */
export declare class MicrosoftGraphClient {
    private readonly baseUrl;
    private readonly pca;
    /**
     * Factory method that instantiate `msal` client and return
     * an instance of `MicrosoftGraphClient`
     *
     * @public
     *
     * @param config - Configuration for Interacting with Graph API
     */
    static create(config: MicrosoftGraphProviderConfig): MicrosoftGraphClient;
    /**
     * @param baseUrl - baseUrl of Graph API {@link MicrosoftGraphProviderConfig.target}
     * @param pca - instance of `msal.ConfidentialClientApplication` that is used to acquire token for Graph API calls
     *
     */
    constructor(baseUrl: string, pca: msal.ConfidentialClientApplication);
    /**
     * Get a collection of resource from Graph API and
     * return an `AsyncIterable` of that resource
     *
     * @public
     * @param path - Resource in Microsoft Graph
     * @param query - OData Query {@link ODataQuery}
     * @param queryMode - Mode to use while querying. Some features are only available at "advanced".
     */
    requestCollection<T>(path: string, query?: ODataQuery, queryMode?: 'basic' | 'advanced'): AsyncIterable<T>;
    /**
     * Abstract on top of {@link MicrosoftGraphClient.requestRaw}
     *
     * @public
     * @param path - Resource in Microsoft Graph
     * @param query - OData Query {@link ODataQuery}
     * @param headers - optional HTTP headers
     */
    requestApi(path: string, query?: ODataQuery, headers?: Record<string, string>): Promise<Response>;
    /**
     * Makes a HTTP call to Graph API with token
     *
     * @param url - HTTP Endpoint of Graph API
     * @param headers - optional HTTP headers
     */
    requestRaw(url: string, headers?: Record<string, string>): Promise<Response>;
    /**
     * Get {@link https://docs.microsoft.com/en-us/graph/api/resources/user | User}
     * from Graph API
     *
     * @public
     * @param userId - The unique identifier for the `User` resource
     * @param query - OData Query {@link ODataQuery}
     *
     */
    getUserProfile(userId: string, query?: ODataQuery): Promise<MicrosoftGraph.User>;
    /**
     * Get {@link https://docs.microsoft.com/en-us/graph/api/resources/profilephoto | profilePhoto}
     * of `User` from Graph API with size limit
     *
     * @param userId - The unique identifier for the `User` resource
     * @param maxSize - Maximum pixel height of the photo
     *
     */
    getUserPhotoWithSizeLimit(userId: string, maxSize: number): Promise<string | undefined>;
    getUserPhoto(userId: string, sizeId?: string): Promise<string | undefined>;
    /**
     * Get a collection of
     * {@link https://docs.microsoft.com/en-us/graph/api/resources/user | User}
     * from Graph API and return as `AsyncIterable`
     *
     * @public
     * @param query - OData Query {@link ODataQuery}
     * @param queryMode - Mode to use while querying. Some features are only available at "advanced".
     */
    getUsers(query?: ODataQuery, queryMode?: 'basic' | 'advanced'): AsyncIterable<MicrosoftGraph.User>;
    /**
     * Get {@link https://docs.microsoft.com/en-us/graph/api/resources/profilephoto | profilePhoto}
     * of `Group` from Graph API with size limit
     *
     * @param groupId - The unique identifier for the `Group` resource
     * @param maxSize - Maximum pixel height of the photo
     *
     */
    getGroupPhotoWithSizeLimit(groupId: string, maxSize: number): Promise<string | undefined>;
    getGroupPhoto(groupId: string, sizeId?: string): Promise<string | undefined>;
    /**
     * Get a collection of
     * {@link https://docs.microsoft.com/en-us/graph/api/resources/group | Group}
     * from Graph API and return as `AsyncIterable`
     *
     * @public
     * @param query - OData Query {@link ODataQuery}
     * @param queryMode - Mode to use while querying. Some features are only available at "advanced".
     */
    getGroups(query?: ODataQuery, queryMode?: 'basic' | 'advanced'): AsyncIterable<MicrosoftGraph.Group>;
    /**
     * Get a collection of
     * {@link https://docs.microsoft.com/en-us/graph/api/resources/user | User}
     * belonging to a `Group` from Graph API and return as `AsyncIterable`
     * @public
     * @param groupId - The unique identifier for the `Group` resource
     *
     */
    getGroupMembers(groupId: string): AsyncIterable<GroupMember>;
    /**
     * Get {@link https://docs.microsoft.com/en-us/graph/api/resources/organization | Organization}
     * from Graph API
     * @public
     * @param tenantId - The unique identifier for the `Organization` resource
     *
     */
    getOrganization(tenantId: string): Promise<MicrosoftGraph.Organization>;
    /**
     * Get {@link https://docs.microsoft.com/en-us/graph/api/resources/profilephoto | profilePhoto}
     * from Graph API
     *
     * @param entityName - type of parent resource, either `User` or `Group`
     * @param id - The unique identifier for the {@link entityName | entityName} resource
     * @param maxSize - Maximum pixel height of the photo
     *
     */
    private getPhotoWithSizeLimit;
    private getPhoto;
    private handleError;
}
