import { Entity } from '@backstage/catalog-model';
import { BadgesApi, BadgeSpec } from './types';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
export declare class BadgesClient implements BadgesApi {
    private readonly discoveryApi;
    private readonly identityApi;
    constructor(options: {
        discoveryApi: DiscoveryApi;
        identityApi: IdentityApi;
    });
    getEntityBadgeSpecs(entity: Entity): Promise<BadgeSpec[]>;
    private getEntityBadgeSpecsUrl;
    private getEntityRouteParams;
}
