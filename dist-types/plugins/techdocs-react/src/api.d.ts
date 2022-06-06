import { CompoundEntityRef } from '@backstage/catalog-model';
import { TechDocsEntityMetadata, TechDocsMetadata } from './types';
/**
 * API to talk to techdocs-backend.
 *
 * @public
 */
export interface TechDocsApi {
    getApiOrigin(): Promise<string>;
    getTechDocsMetadata(entityId: CompoundEntityRef): Promise<TechDocsMetadata>;
    getEntityMetadata(entityId: CompoundEntityRef): Promise<TechDocsEntityMetadata>;
}
/**
 * Utility API reference for the {@link TechDocsApi}.
 *
 * @public
 */
export declare const techdocsApiRef: import("@backstage/core-plugin-api").ApiRef<TechDocsApi>;
/**
 * The outcome of a docs sync operation.
 *
 * @public
 */
export declare type SyncResult = 'cached' | 'updated';
/**
 * API which talks to TechDocs storage to fetch files to render.
 *
 * @public
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
 * Utility API reference for the {@link TechDocsStorageApi}.
 *
 * @public
 */
export declare const techdocsStorageApiRef: import("@backstage/core-plugin-api").ApiRef<TechDocsStorageApi>;
