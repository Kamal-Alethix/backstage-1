import { CompoundEntityRef } from '@backstage/catalog-model';
import { TechDocsEntityMetadata, TechDocsMetadata } from '@backstage/plugin-techdocs-react';
/**
 * Utility API reference for the {@link TechDocsStorageApi}.
 *
 * @public
 * @deprecated Import from `@backstage/plugin-techdocs-react` instead
 */
export declare const techdocsStorageApiRef: import("@backstage/core-plugin-api").ApiRef<TechDocsStorageApi>;
/**
 * Utility API reference for the {@link TechDocsApi}.
 *
 * @public
 * @deprecated Import from `@backstage/plugin-techdocs-react` instead
 */
export declare const techdocsApiRef: import("@backstage/core-plugin-api").ApiRef<TechDocsApi>;
/**
 * The outcome of a docs sync operation.
 *
 * @public
 * @deprecated Import from `@backstage/plugin-techdocs-react` instead
 */
export declare type SyncResult = 'cached' | 'updated';
/**
 * API which talks to TechDocs storage to fetch files to render.
 *
 * @public
 * @deprecated Import from `@backstage/plugin-techdocs-react` instead
 */
export interface TechDocsStorageApi {
    getApiOrigin(): Promise<string>;
    getStorageUrl(): Promise<string>;
    getBuilder(): Promise<string>;
    getEntityDocs(entityId: CompoundEntityRef, path: string): Promise<string>;
    syncEntityDocs(entityId: CompoundEntityRef, logHandler?: (line: string) => void): Promise<SyncResult>;
    getBaseUrl(oldBaseUrl: string, entityId: CompoundEntityRef, path: string): Promise<string>;
}
/**
 * API to talk to techdocs-backend.
 *
 * @public
 * @deprecated Import from `@backstage/plugin-techdocs-react` instead
 */
export interface TechDocsApi {
    getApiOrigin(): Promise<string>;
    getTechDocsMetadata(entityId: CompoundEntityRef): Promise<TechDocsMetadata>;
    getEntityMetadata(entityId: CompoundEntityRef): Promise<TechDocsEntityMetadata>;
}
