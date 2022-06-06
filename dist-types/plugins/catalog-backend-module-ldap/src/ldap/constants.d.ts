/**
 * The name of an entity annotation, that references the RDN of the LDAP object
 * it was ingested from.
 *
 * The RDN is the name of the leftmost attribute that identifies the item; for
 * example, for an item with the fully qualified DN
 * uid=john,ou=people,ou=spotify,dc=spotify,dc=net the generated entity would
 * have this annotation, with the value "john".
 *
 * @public
 */
export declare const LDAP_RDN_ANNOTATION = "backstage.io/ldap-rdn";
/**
 * The name of an entity annotation, that references the DN of the LDAP object
 * it was ingested from.
 *
 * The DN is the fully qualified name that identifies the item; for example,
 * for an item with the DN uid=john,ou=people,ou=spotify,dc=spotify,dc=net the
 * generated entity would have this annotation, with that full string as its
 * value.
 *
 * @public
 */
export declare const LDAP_DN_ANNOTATION = "backstage.io/ldap-dn";
/**
 * The name of an entity annotation, that references the UUID of the LDAP
 * object it was ingested from.
 *
 * The UUID is the globally unique ID that identifies the item; for example,
 * for an item with the UUID 76ef928a-b251-1037-9840-d78227f36a7e, the
 * generated entity would have this annotation, with that full string as its
 * value.
 *
 * @public
 */
export declare const LDAP_UUID_ANNOTATION = "backstage.io/ldap-uuid";
