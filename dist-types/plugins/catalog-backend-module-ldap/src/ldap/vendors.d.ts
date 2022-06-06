import { SearchEntry } from 'ldapjs';
/**
 * An LDAP Vendor handles unique nuances between different vendors.
 *
 * @public
 */
export declare type LdapVendor = {
    /**
     * The attribute name that holds the distinguished name (DN) for an entry.
     */
    dnAttributeName: string;
    /**
     * The attribute name that holds a universal unique identifier for an entry.
     */
    uuidAttributeName: string;
    /**
     * Decode ldap entry values for a given attribute name to their string representation.
     *
     * @param entry - The ldap entry
     * @param name - The attribute to decode
     */
    decodeStringAttribute: (entry: SearchEntry, name: string) => string[];
};
export declare const DefaultLdapVendor: LdapVendor;
export declare const ActiveDirectoryVendor: LdapVendor;
