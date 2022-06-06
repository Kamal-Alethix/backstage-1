import { TaskRunner } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import { EntityProvider, EntityProviderConnection, CatalogProcessor, LocationSpec, CatalogProcessorEmit } from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
import { UserEntity, GroupEntity } from '@backstage/catalog-model';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import * as msal from '@azure/msal-node';
import { Response } from 'node-fetch';

/**
 * The configuration parameters for a single Microsoft Graph provider.
 *
 * @public
 */
declare type MicrosoftGraphProviderConfig = {
    /**
     * The prefix of the target that this matches on, e.g.
     * "https://graph.microsoft.com/v1.0", with no trailing slash.
     */
    target: string;
    /**
     * The auth authority used.
     *
     * E.g. "https://login.microsoftonline.com"
     */
    authority?: string;
    /**
     * The tenant whose org data we are interested in.
     */
    tenantId: string;
    /**
     * The OAuth client ID to use for authenticating requests.
     */
    clientId: string;
    /**
     * The OAuth client secret to use for authenticating requests.
     */
    clientSecret: string;
    /**
     * The filter to apply to extract users.
     *
     * E.g. "accountEnabled eq true and userType eq 'member'"
     */
    userFilter?: string;
    /**
     * The "expand" argument to apply to users.
     *
     * E.g. "manager"
     */
    userExpand?: string;
    /**
     * The filter to apply to extract users by groups memberships.
     *
     * E.g. "displayName eq 'Backstage Users'"
     */
    userGroupMemberFilter?: string;
    /**
     * The search criteria to apply to extract users by groups memberships.
     *
     * E.g. "\"displayName:-team\"" would only match groups which contain '-team'
     */
    userGroupMemberSearch?: string;
    /**
     * The "expand" argument to apply to groups.
     *
     * E.g. "member"
     */
    groupExpand?: string;
    /**
     * The filter to apply to extract groups.
     *
     * E.g. "securityEnabled eq false and mailEnabled eq true"
     */
    groupFilter?: string;
    /**
     * The search criteria to apply to extract groups.
     *
     * E.g. "\"displayName:-team\"" would only match groups which contain '-team'
     */
    groupSearch?: string;
    /**
     * The fields to be fetched on query.
     *
     * E.g. ["id", "displayName", "description"]
     */
    groupSelect?: string[];
    /**
     * By default, the Microsoft Graph API only provides the basic feature set
     * for querying. Certain features are limited to advanced query capabilities
     * (see https://docs.microsoft.com/en-us/graph/aad-advanced-queries)
     * and need to be enabled.
     *
     * Some features like `$expand` are not available for advanced queries, though.
     */
    queryMode?: 'basic' | 'advanced';
};
/**
 * Parses configuration.
 *
 * @param config - The root of the msgraph config hierarchy
 *
 * @public
 */
declare function readMicrosoftGraphConfig(config: Config): MicrosoftGraphProviderConfig[];

/**
 * OData (Open Data Protocol) Query
 *
 * {@link https://docs.microsoft.com/en-us/odata/concepts/queryoptions-overview}
 * {@link https://docs.microsoft.com/en-us/graph/query-parameters}
 * @public
 */
declare type ODataQuery = {
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
declare type GroupMember = (MicrosoftGraph.Group & {
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
declare class MicrosoftGraphClient {
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

/**
 * The (primary) user email. Also used by the Microsoft auth provider to resolve the User entity.
 *
 * @public
 */
declare const MICROSOFT_EMAIL_ANNOTATION = "microsoft.com/email";
/**
 * The tenant id used by the Microsoft Graph API
 *
 * @public
 */
declare const MICROSOFT_GRAPH_TENANT_ID_ANNOTATION = "graph.microsoft.com/tenant-id";
/**
 * The group id used by the Microsoft Graph API
 *
 * @public
 */
declare const MICROSOFT_GRAPH_GROUP_ID_ANNOTATION = "graph.microsoft.com/group-id";
/**
 * The user id used by the Microsoft Graph API
 *
 * @public
 */
declare const MICROSOFT_GRAPH_USER_ID_ANNOTATION = "graph.microsoft.com/user-id";

/**
 * Takes an input string and cleans it up to become suitable as an entity name.
 *
 * @public
 */
declare function normalizeEntityName(name: string): string;

/**
 * Customize the ingested User entity
 *
 * @public
 */
declare type UserTransformer = (user: MicrosoftGraph.User, userPhoto?: string) => Promise<UserEntity | undefined>;
/**
 * Customize the ingested organization Group entity
 *
 * @public
 */
declare type OrganizationTransformer = (organization: MicrosoftGraph.Organization) => Promise<GroupEntity | undefined>;
/**
 * Customize the ingested Group entity
 *
 * @public
 */
declare type GroupTransformer = (group: MicrosoftGraph.Group, groupPhoto?: string) => Promise<GroupEntity | undefined>;

/**
 * The default implementation of the transformation from a graph user entry to
 * a User entity.
 *
 * @public
 */
declare function defaultUserTransformer(user: MicrosoftGraph.User, userPhoto?: string): Promise<UserEntity | undefined>;
/**
 * The default implementation of the transformation from a graph organization
 * entry to a Group entity.
 *
 * @public
 */
declare function defaultOrganizationTransformer(organization: MicrosoftGraph.Organization): Promise<GroupEntity | undefined>;
/**
 * The default implementation of the transformation from a graph group entry to
 * a Group entity.
 *
 * @public
 */
declare function defaultGroupTransformer(group: MicrosoftGraph.Group, groupPhoto?: string): Promise<GroupEntity | undefined>;
/**
 * Reads an entire org as Group and User entities.
 *
 * @public
 */
declare function readMicrosoftGraphOrg(client: MicrosoftGraphClient, tenantId: string, options: {
    userExpand?: string;
    userFilter?: string;
    userGroupMemberSearch?: string;
    userGroupMemberFilter?: string;
    groupExpand?: string;
    groupSearch?: string;
    groupFilter?: string;
    groupSelect?: string[];
    queryMode?: 'basic' | 'advanced';
    userTransformer?: UserTransformer;
    groupTransformer?: GroupTransformer;
    organizationTransformer?: OrganizationTransformer;
    logger: Logger;
}): Promise<{
    users: UserEntity[];
    groups: GroupEntity[];
}>;

/**
 * Options for {@link MicrosoftGraphOrgEntityProvider}.
 *
 * @public
 */
interface MicrosoftGraphOrgEntityProviderOptions {
    /**
     * A unique, stable identifier for this provider.
     *
     * @example "production"
     */
    id: string;
    /**
     * The target that this provider should consume.
     *
     * Should exactly match the "target" field of one of the providers
     * configuration entries.
     */
    target: string;
    /**
     * The logger to use.
     */
    logger: Logger;
    /**
     * The refresh schedule to use.
     *
     * @remarks
     *
     * If you pass in 'manual', you are responsible for calling the `read` method
     * manually at some interval.
     *
     * But more commonly you will pass in the result of
     * {@link @backstage/backend-tasks#PluginTaskScheduler.createScheduledTaskRunner}
     * to enable automatic scheduling of tasks.
     */
    schedule: 'manual' | TaskRunner;
    /**
     * The function that transforms a user entry in msgraph to an entity.
     */
    userTransformer?: UserTransformer;
    /**
     * The function that transforms a group entry in msgraph to an entity.
     */
    groupTransformer?: GroupTransformer;
    /**
     * The function that transforms an organization entry in msgraph to an entity.
     */
    organizationTransformer?: OrganizationTransformer;
}
/**
 * Reads user and group entries out of Microsoft Graph, and provides them as
 * User and Group entities for the catalog.
 *
 * @public
 */
declare class MicrosoftGraphOrgEntityProvider implements EntityProvider {
    private options;
    private connection?;
    private scheduleFn?;
    static fromConfig(configRoot: Config, options: MicrosoftGraphOrgEntityProviderOptions): MicrosoftGraphOrgEntityProvider;
    constructor(options: {
        id: string;
        provider: MicrosoftGraphProviderConfig;
        logger: Logger;
        userTransformer?: UserTransformer;
        groupTransformer?: GroupTransformer;
        organizationTransformer?: OrganizationTransformer;
    });
    /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.getProviderName} */
    getProviderName(): string;
    /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.connect} */
    connect(connection: EntityProviderConnection): Promise<void>;
    /**
     * Runs one complete ingestion loop. Call this method regularly at some
     * appropriate cadence.
     */
    read(options?: {
        logger?: Logger;
    }): Promise<void>;
    private schedule;
}

/**
 * Extracts teams and users out of a the Microsoft Graph API.
 *
 * @public
 */
declare class MicrosoftGraphOrgReaderProcessor implements CatalogProcessor {
    private readonly providers;
    private readonly logger;
    private readonly userTransformer?;
    private readonly groupTransformer?;
    private readonly organizationTransformer?;
    static fromConfig(config: Config, options: {
        logger: Logger;
        userTransformer?: UserTransformer;
        groupTransformer?: GroupTransformer;
        organizationTransformer?: OrganizationTransformer;
    }): MicrosoftGraphOrgReaderProcessor;
    constructor(options: {
        providers: MicrosoftGraphProviderConfig[];
        logger: Logger;
        userTransformer?: UserTransformer;
        groupTransformer?: GroupTransformer;
        organizationTransformer?: OrganizationTransformer;
    });
    getProcessorName(): string;
    readLocation(location: LocationSpec, _optional: boolean, emit: CatalogProcessorEmit): Promise<boolean>;
}

export { GroupMember, GroupTransformer, MICROSOFT_EMAIL_ANNOTATION, MICROSOFT_GRAPH_GROUP_ID_ANNOTATION, MICROSOFT_GRAPH_TENANT_ID_ANNOTATION, MICROSOFT_GRAPH_USER_ID_ANNOTATION, MicrosoftGraphClient, MicrosoftGraphOrgEntityProvider, MicrosoftGraphOrgEntityProviderOptions, MicrosoftGraphOrgReaderProcessor, MicrosoftGraphProviderConfig, ODataQuery, OrganizationTransformer, UserTransformer, defaultGroupTransformer, defaultOrganizationTransformer, defaultUserTransformer, normalizeEntityName, readMicrosoftGraphConfig, readMicrosoftGraphOrg };
