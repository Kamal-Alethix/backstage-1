import { Logger } from 'winston';
import { CatalogApi } from '@backstage/catalog-client';
import { UserEntity } from '@backstage/catalog-model';
import { TokenManager } from '@backstage/backend-common';
declare type UserQuery = {
    annotations: Record<string, string>;
};
declare type MemberClaimQuery = {
    entityRefs: string[];
    logger?: Logger;
};
/**
 * A catalog client tailored for reading out identity data from the catalog.
 */
export declare class CatalogIdentityClient {
    private readonly catalogApi;
    private readonly tokenManager;
    constructor(options: {
        catalogApi: CatalogApi;
        tokenManager: TokenManager;
    });
    /**
     * Looks up a single user using a query.
     *
     * Throws a NotFoundError or ConflictError if 0 or multiple users are found.
     */
    findUser(query: UserQuery): Promise<UserEntity>;
    /**
     * Resolve additional entity claims from the catalog, using the passed-in entity names. Designed
     * to be used within a `signInResolver` where additional entity claims might be provided, but
     * group membership and transient group membership lean on imported catalog relations.
     *
     * Returns a superset of the entity names that can be passed directly to `issueToken` as `ent`.
     */
    resolveCatalogMembership(query: MemberClaimQuery): Promise<string[]>;
}
export {};
