import { CompoundEntityRef } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { DiscoveryApi, FetchApi, IdentityApi } from '@backstage/core-plugin-api';
import { TechDocsEntityMetadata, TechDocsMetadata } from '@backstage/plugin-techdocs-react';
import { SyncResult, TechDocsApi, TechDocsStorageApi } from './api';
/**
 * API to talk to `techdocs-backend`.
 *
 * @public
 */
export declare class TechDocsClient implements TechDocsApi {
    configApi: Config;
    discoveryApi: DiscoveryApi;
    private fetchApi;
    constructor(options: {
        configApi: Config;
        discoveryApi: DiscoveryApi;
        fetchApi: FetchApi;
    });
    getApiOrigin(): Promise<string>;
    /**
     * Retrieve TechDocs metadata.
     *
     * When docs are built, we generate a techdocs_metadata.json and store it along with the generated
     * static files. It includes necessary data about the docs site. This method requests techdocs-backend
     * which retrieves the TechDocs metadata.
     *
     * @param entityId - Object containing entity data like name, namespace, etc.
     */
    getTechDocsMetadata(entityId: CompoundEntityRef): Promise<TechDocsMetadata>;
    /**
     * Retrieve metadata about an entity.
     *
     * This method requests techdocs-backend which uses the catalog APIs to respond with filtered
     * information required here.
     *
     * @param entityId - Object containing entity data like name, namespace, etc.
     */
    getEntityMetadata(entityId: CompoundEntityRef): Promise<TechDocsEntityMetadata>;
}
/**
 * API which talks to TechDocs storage to fetch files to render.
 *
 * @public
 */
export declare class TechDocsStorageClient implements TechDocsStorageApi {
    configApi: Config;
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
    private fetchApi;
    constructor(options: {
        configApi: Config;
        discoveryApi: DiscoveryApi;
        identityApi: IdentityApi;
        fetchApi: FetchApi;
    });
    getApiOrigin(): Promise<string>;
    getStorageUrl(): Promise<string>;
    getBuilder(): Promise<string>;
    /**
     * Fetch HTML content as text for an individual docs page in an entity's docs site.
     *
     * @param entityId - Object containing entity data like name, namespace, etc.
     * @param path - The unique path to an individual docs page e.g. overview/what-is-new
     * @returns HTML content of the docs page as string
     * @throws Throws error when the page is not found.
     */
    getEntityDocs(entityId: CompoundEntityRef, path: string): Promise<string>;
    /**
     * Check if docs are on the latest version and trigger rebuild if not
     *
     * @param entityId - Object containing entity data like name, namespace, etc.
     * @param logHandler - Callback to receive log messages from the build process
     * @returns Whether documents are currently synchronized to newest version
     * @throws Throws error on error from sync endpoint in Techdocs Backend
     */
    syncEntityDocs(entityId: CompoundEntityRef, logHandler?: (line: string) => void): Promise<SyncResult>;
    getBaseUrl(oldBaseUrl: string, entityId: CompoundEntityRef, path: string): Promise<string>;
}
