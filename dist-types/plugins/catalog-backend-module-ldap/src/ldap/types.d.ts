import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import { SearchEntry } from 'ldapjs';
import { LdapVendor } from './vendors';
import { GroupConfig, UserConfig } from './config';
/**
 * Customize the ingested User entity
 *
 * @param vendor - The LDAP vendor that can be used to find and decode vendor
 *        specific attributes
 * @param config - The User specific config used by the default transformer.
 * @param user - The found LDAP entry in its source format. This is the entry
 *        that you want to transform
 * @returns A `UserEntity` or `undefined` if you want to ignore the found user
 *          for being ingested by the catalog
 *
 * @public
 */
export declare type UserTransformer = (vendor: LdapVendor, config: UserConfig, user: SearchEntry) => Promise<UserEntity | undefined>;
/**
 * Customize the ingested Group entity
 *
 * @param vendor - The LDAP vendor that can be used to find and decode vendor
 *        specific attributes
 * @param config - The Group specific config used by the default transformer.
 * @param group - The found LDAP entry in its source format. This is the entry
 *        that you want to transform
 * @returns A `GroupEntity` or `undefined` if you want to ignore the found group
 *          for being ingested by the catalog
 *
 * @public
 */
export declare type GroupTransformer = (vendor: LdapVendor, config: GroupConfig, group: SearchEntry) => Promise<GroupEntity | undefined>;
