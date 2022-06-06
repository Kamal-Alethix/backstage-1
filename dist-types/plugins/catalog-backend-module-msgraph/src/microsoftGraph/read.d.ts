import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { Logger } from 'winston';
import { MicrosoftGraphClient } from './client';
import { GroupTransformer, OrganizationTransformer, UserTransformer } from './types';
/**
 * The default implementation of the transformation from a graph user entry to
 * a User entity.
 *
 * @public
 */
export declare function defaultUserTransformer(user: MicrosoftGraph.User, userPhoto?: string): Promise<UserEntity | undefined>;
export declare function readMicrosoftGraphUsers(client: MicrosoftGraphClient, options: {
    queryMode?: 'basic' | 'advanced';
    userFilter?: string;
    userExpand?: string;
    transformer?: UserTransformer;
    logger: Logger;
}): Promise<{
    users: UserEntity[];
}>;
export declare function readMicrosoftGraphUsersInGroups(client: MicrosoftGraphClient, options: {
    queryMode?: 'basic' | 'advanced';
    userExpand?: string;
    userGroupMemberSearch?: string;
    userGroupMemberFilter?: string;
    groupExpand?: string;
    transformer?: UserTransformer;
    logger: Logger;
}): Promise<{
    users: UserEntity[];
}>;
/**
 * The default implementation of the transformation from a graph organization
 * entry to a Group entity.
 *
 * @public
 */
export declare function defaultOrganizationTransformer(organization: MicrosoftGraph.Organization): Promise<GroupEntity | undefined>;
export declare function readMicrosoftGraphOrganization(client: MicrosoftGraphClient, tenantId: string, options?: {
    transformer?: OrganizationTransformer;
}): Promise<{
    rootGroup?: GroupEntity;
}>;
/**
 * The default implementation of the transformation from a graph group entry to
 * a Group entity.
 *
 * @public
 */
export declare function defaultGroupTransformer(group: MicrosoftGraph.Group, groupPhoto?: string): Promise<GroupEntity | undefined>;
export declare function readMicrosoftGraphGroups(client: MicrosoftGraphClient, tenantId: string, options?: {
    queryMode?: 'basic' | 'advanced';
    groupExpand?: string;
    groupFilter?: string;
    groupSearch?: string;
    groupSelect?: string[];
    groupTransformer?: GroupTransformer;
    organizationTransformer?: OrganizationTransformer;
}): Promise<{
    groups: GroupEntity[];
    rootGroup: GroupEntity | undefined;
    groupMember: Map<string, Set<string>>;
    groupMemberOf: Map<string, Set<string>>;
}>;
export declare function resolveRelations(rootGroup: GroupEntity | undefined, groups: GroupEntity[], users: UserEntity[], groupMember: Map<string, Set<string>>, groupMemberOf: Map<string, Set<string>>): void;
/**
 * Reads an entire org as Group and User entities.
 *
 * @public
 */
export declare function readMicrosoftGraphOrg(client: MicrosoftGraphClient, tenantId: string, options: {
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
