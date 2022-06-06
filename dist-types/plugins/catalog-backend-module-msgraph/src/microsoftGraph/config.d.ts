import { Config } from '@backstage/config';
/**
 * The configuration parameters for a single Microsoft Graph provider.
 *
 * @public
 */
export declare type MicrosoftGraphProviderConfig = {
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
export declare function readMicrosoftGraphConfig(config: Config): MicrosoftGraphProviderConfig[];
