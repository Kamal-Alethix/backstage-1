import { CompoundEntityRef } from '@backstage/catalog-model';
import { TechDocsStorageApi } from '../../api';
import type { Transformer } from './transformer';
declare type AddBaseUrlOptions = {
    techdocsStorageApi: TechDocsStorageApi;
    entityId: CompoundEntityRef;
    path: string;
};
export declare const addBaseUrl: ({ techdocsStorageApi, entityId, path, }: AddBaseUrlOptions) => Transformer;
export {};
