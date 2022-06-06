import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import { SearchEntry } from 'ldapjs';
import { LdapClient } from './client';
import { GroupConfig, UserConfig } from './config';
import { LdapVendor } from './vendors';
import { Logger } from 'winston';
import { GroupTransformer, UserTransformer } from './types';
/**
 * The default implementation of the transformation from an LDAP entry to a
 * User entity.
 *
 * @public
 */
export declare function defaultUserTransformer(vendor: LdapVendor, config: UserConfig, entry: SearchEntry): Promise<UserEntity | undefined>;
/**
 * Reads users out of an LDAP provider.
 *
 * @param client - The LDAP client
 * @param config - The user data configuration
 * @param opts - Additional options
 */
export declare function readLdapUsers(client: LdapClient, config: UserConfig, opts?: {
    transformer?: UserTransformer;
}): Promise<{
    users: UserEntity[];
    userMemberOf: Map<string, Set<string>>;
}>;
/**
 * The default implementation of the transformation from an LDAP entry to a
 * Group entity.
 *
 * @public
 */
export declare function defaultGroupTransformer(vendor: LdapVendor, config: GroupConfig, entry: SearchEntry): Promise<GroupEntity | undefined>;
/**
 * Reads groups out of an LDAP provider.
 *
 * @param client - The LDAP client
 * @param config - The group data configuration
 * @param opts - Additional options
 */
export declare function readLdapGroups(client: LdapClient, config: GroupConfig, opts?: {
    transformer?: GroupTransformer;
}): Promise<{
    groups: GroupEntity[];
    groupMemberOf: Map<string, Set<string>>;
    groupMember: Map<string, Set<string>>;
}>;
/**
 * Reads users and groups out of an LDAP provider.
 *
 * @param client - The LDAP client
 * @param userConfig - The user data configuration
 * @param groupConfig - The group data configuration
 * @param options - Additional options
 *
 * @public
 */
export declare function readLdapOrg(client: LdapClient, userConfig: UserConfig, groupConfig: GroupConfig, options: {
    groupTransformer?: GroupTransformer;
    userTransformer?: UserTransformer;
    logger: Logger;
}): Promise<{
    users: UserEntity[];
    groups: GroupEntity[];
}>;
/**
 * Takes groups and entities with empty relations, and fills in the various
 * relations that were returned by the readers, and forms the org hierarchy.
 *
 * @param groups - Group entities with empty relations; modified in place
 * @param users - User entities with empty relations; modified in place
 * @param userMemberOf - For a user DN, the set of group DNs or UUIDs that the
 *        user is a member of
 * @param groupMemberOf - For a group DN, the set of group DNs or UUIDs that
 *        the group is a member of (parents in the hierarchy)
 * @param groupMember - For a group DN, the set of group DNs or UUIDs that are
 *        members of the group (children in the hierarchy)
 */
export declare function resolveRelations(groups: GroupEntity[], users: UserEntity[], userMemberOf: Map<string, Set<string>>, groupMemberOf: Map<string, Set<string>>, groupMember: Map<string, Set<string>>): void;
