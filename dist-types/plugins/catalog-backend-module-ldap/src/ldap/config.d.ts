import { Config } from '@backstage/config';
import { JsonValue } from '@backstage/types';
import { SearchOptions } from 'ldapjs';
/**
 * The configuration parameters for a single LDAP provider.
 *
 * @public
 */
export declare type LdapProviderConfig = {
    target: string;
    tls?: TLSConfig;
    bind?: BindConfig;
    users: UserConfig;
    groups: GroupConfig;
};
/**
 * TLS settings
 *
 * @public
 */
export declare type TLSConfig = {
    rejectUnauthorized?: boolean;
};
/**
 * The settings to use for the a command.
 *
 * @public
 */
export declare type BindConfig = {
    dn: string;
    secret: string;
};
/**
 * The settings that govern the reading and interpretation of users.
 *
 * @public
 */
export declare type UserConfig = {
    dn: string;
    options: SearchOptions;
    set?: {
        [path: string]: JsonValue;
    };
    map: {
        rdn: string;
        name: string;
        description?: string;
        displayName: string;
        email: string;
        picture?: string;
        memberOf: string;
    };
};
/**
 * The settings that govern the reading and interpretation of groups.
 *
 * @public
 */
export declare type GroupConfig = {
    dn: string;
    options: SearchOptions;
    set?: {
        [path: string]: JsonValue;
    };
    map: {
        rdn: string;
        name: string;
        description: string;
        type: string;
        displayName: string;
        email?: string;
        picture?: string;
        memberOf: string;
        members: string;
    };
};
/**
 * Parses configuration.
 *
 * @param config - The root of the LDAP config hierarchy
 *
 * @public
 */
export declare function readLdapConfig(config: Config): LdapProviderConfig[];
