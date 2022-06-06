import { Error as LDAPError, SearchEntry } from 'ldapjs';
import { LdapVendor } from './vendors';
/**
 * Builds a string form of an LDAP Error structure.
 *
 * @param error - The error
 */
export declare function errorString(error: LDAPError): string;
/**
 * Maps a single-valued attribute to a consumer.
 *
 * This helper can be useful when implementing a user or group transformer.
 *
 * @param entry - The LDAP source entry
 * @param vendor - The LDAP vendor
 * @param attributeName - The source attribute to map. If the attribute is
 *        undefined the mapping will be silently ignored.
 * @param setter - The function to be called with the decoded attribute from the
 *        source entry
 *
 * @public
 */
export declare function mapStringAttr(entry: SearchEntry, vendor: LdapVendor, attributeName: string | undefined, setter: (value: string) => void): void;
export declare type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends object ? RecursivePartial<T[P]> : T[P];
};
