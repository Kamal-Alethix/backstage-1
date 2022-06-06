import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import { GithubCredentialType } from '@backstage/integration';
import { graphql } from '@octokit/graphql';
export declare type QueryResponse = {
    organization?: Organization;
    repositoryOwner?: Organization | User;
};
export declare type Organization = {
    membersWithRole?: Connection<User>;
    team?: Team;
    teams?: Connection<Team>;
    repositories?: Connection<Repository>;
};
export declare type PageInfo = {
    hasNextPage: boolean;
    endCursor?: string;
};
export declare type User = {
    login: string;
    bio?: string;
    avatarUrl?: string;
    email?: string;
    name?: string;
    repositories?: Connection<Repository>;
};
export declare type Team = {
    slug: string;
    combinedSlug: string;
    name?: string;
    description?: string;
    avatarUrl?: string;
    editTeamUrl?: string;
    parentTeam?: Team;
    members: Connection<User>;
};
export declare type Repository = {
    name: string;
    url: string;
    isArchived: boolean;
    defaultBranchRef: {
        name: string;
    } | null;
};
export declare type Connection<T> = {
    pageInfo: PageInfo;
    nodes: T[];
};
/**
 * Gets all the users out of a GitHub organization.
 *
 * Note that the users will not have their memberships filled in.
 *
 * @param client - An octokit graphql client
 * @param org - The slug of the org to read
 */
export declare function getOrganizationUsers(client: typeof graphql, org: string, tokenType: GithubCredentialType, userNamespace?: string): Promise<{
    users: UserEntity[];
}>;
/**
 * Gets all the teams out of a GitHub organization.
 *
 * Note that the teams will not have any relations apart from parent filled in.
 *
 * @param client - An octokit graphql client
 * @param org - The slug of the org to read
 */
export declare function getOrganizationTeams(client: typeof graphql, org: string, orgNamespace?: string): Promise<{
    groups: GroupEntity[];
    groupMemberUsers: Map<string, string[]>;
}>;
export declare function getOrganizationRepositories(client: typeof graphql, org: string): Promise<{
    repositories: Repository[];
}>;
/**
 * Gets all the users out of a GitHub organization.
 *
 * Note that the users will not have their memberships filled in.
 *
 * @param client - An octokit graphql client
 * @param org - The slug of the org to read
 * @param teamSlug - The slug of the team to read
 */
export declare function getTeamMembers(client: typeof graphql, org: string, teamSlug: string): Promise<{
    members: string[];
}>;
/**
 * Assists in repeatedly executing a query with a paged response.
 *
 * Requires that the query accepts a $cursor variable.
 *
 * @param client - The octokit client
 * @param query - The query to execute
 * @param connection - A function that, given the response, picks out the actual
 *                   Connection object that's being iterated
 * @param mapper - A function that, given one of the nodes in the Connection,
 *               returns the model mapped form of it
 * @param variables - The variable values that the query needs, minus the cursor
 */
export declare function queryWithPaging<GraphqlType, OutputType, Variables extends {}, Response = QueryResponse>(client: typeof graphql, query: string, connection: (response: Response) => Connection<GraphqlType> | undefined, mapper: (item: GraphqlType) => Promise<OutputType> | OutputType, variables: Variables): Promise<OutputType[]>;
