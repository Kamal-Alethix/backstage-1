import { Entity, EntityMeta } from '@backstage/catalog-model';
export interface ReaderEntityMeta extends EntityMeta {
    uid: string;
    etag: string;
    namespace: string;
    annotations: Record<string, string>;
    labels: Record<string, string>;
}
export interface ReaderEntity extends Entity {
    metadata: ReaderEntityMeta;
}
export declare class CatalogClient {
    private baseUrl;
    constructor(baseUrl: string);
    list(): Promise<ReaderEntity[]>;
}
