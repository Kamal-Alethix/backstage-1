/// <reference types="node" />
import { UrlReader } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { JsonValue } from '@backstage/types';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { CatalogProcessor, LocationSpec } from '../../api';
/** @public */
export declare type PlaceholderResolverRead = (url: string) => Promise<Buffer>;
/** @public */
export declare type PlaceholderResolverResolveUrl = (url: string, base: string) => string;
/** @public */
export declare type PlaceholderResolverParams = {
    key: string;
    value: JsonValue;
    baseUrl: string;
    read: PlaceholderResolverRead;
    resolveUrl: PlaceholderResolverResolveUrl;
};
/** @public */
export declare type PlaceholderResolver = (params: PlaceholderResolverParams) => Promise<JsonValue>;
/** @public */
export declare type PlaceholderProcessorOptions = {
    resolvers: Record<string, PlaceholderResolver>;
    reader: UrlReader;
    integrations: ScmIntegrationRegistry;
};
/**
 * Traverses raw entity JSON looking for occurrences of $-prefixed placeholders
 * that it then fills in with actual data.
 * @public
 */
export declare class PlaceholderProcessor implements CatalogProcessor {
    private readonly options;
    constructor(options: PlaceholderProcessorOptions);
    getProcessorName(): string;
    preProcessEntity(entity: Entity, location: LocationSpec): Promise<Entity>;
}
export declare function yamlPlaceholderResolver(params: PlaceholderResolverParams): Promise<JsonValue>;
export declare function jsonPlaceholderResolver(params: PlaceholderResolverParams): Promise<JsonValue>;
export declare function textPlaceholderResolver(params: PlaceholderResolverParams): Promise<JsonValue>;
