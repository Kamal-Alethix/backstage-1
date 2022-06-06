import { Client, SearchEntry, SearchOptions } from 'ldapjs';
import { Logger } from 'winston';
import { BindConfig, TLSConfig } from './config';
import { LdapVendor } from './vendors';
/**
 * Basic wrapper for the `ldapjs` library.
 *
 * Helps out with promisifying calls, paging, binding etc.
 *
 * @public
 */
export declare class LdapClient {
    private readonly client;
    private readonly logger;
    private vendor;
    static create(logger: Logger, target: string, bind?: BindConfig, tls?: TLSConfig): Promise<LdapClient>;
    constructor(client: Client, logger: Logger);
    /**
     * Performs an LDAP search operation.
     *
     * @param dn - The fully qualified base DN to search within
     * @param options - The search options
     */
    search(dn: string, options: SearchOptions): Promise<SearchEntry[]>;
    /**
     * Performs an LDAP search operation, calls a function on each entry to limit memory usage
     *
     * @param dn - The fully qualified base DN to search within
     * @param options - The search options
     * @param f - The callback to call on each search entry
     */
    searchStreaming(dn: string, options: SearchOptions, f: (entry: SearchEntry) => void): Promise<void>;
    /**
     * Get the Server Vendor.
     * Currently only detects Microsoft Active Directory Servers.
     *
     * @see https://ldapwiki.com/wiki/Determine%20LDAP%20Server%20Vendor
     */
    getVendor(): Promise<LdapVendor>;
    /**
     * Get the Root DSE.
     *
     * @see https://ldapwiki.com/wiki/RootDSE
     */
    getRootDSE(): Promise<SearchEntry | undefined>;
}
