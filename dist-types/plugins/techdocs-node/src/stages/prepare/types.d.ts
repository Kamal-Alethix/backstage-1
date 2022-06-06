import type { Entity } from '@backstage/catalog-model';
import { UrlReader } from '@backstage/backend-common';
import { Logger } from 'winston';
/**
 * A unique identifier of the tree blob, usually the commit SHA or etag from the target.
 * @public
 */
export declare type ETag = string;
/**
 * Options for building preparers
 * @public
 */
export declare type PreparerConfig = {
    logger: Logger;
    reader: UrlReader;
};
/**
 * Options for configuring the content preparation process.
 * @public
 */
export declare type PreparerOptions = {
    /**
     * An instance of the logger
     */
    logger?: Logger;
    /**
     * see {@link ETag}
     */
    etag?: ETag;
};
/**
 * Result of the preparation step.
 * @public
 */
export declare type PreparerResponse = {
    /**
     * The path to directory where the tree is downloaded.
     */
    preparedDir: string;
    /**
     * see {@link ETag}
     */
    etag: ETag;
};
/**
 * Definition of a TechDocs preparer
 * @public
 */
export declare type PreparerBase = {
    /**
     * Given an Entity definition from the Software Catalog, go and prepare a directory
     * with contents from the location in temporary storage and return the path.
     *
     * @param entity - The entity from the Software Catalog
     * @param options - If etag is provided, it will be used to check if the target has
     *        updated since the last build.
     * @throws `NotModifiedError` when the prepared directory has not been changed since the last build.
     */
    prepare(entity: Entity, options?: PreparerOptions): Promise<PreparerResponse>;
};
/**
 * Definition for a TechDocs preparer builder
 * @public
 */
export declare type PreparerBuilder = {
    register(protocol: RemoteProtocol, preparer: PreparerBase): void;
    get(entity: Entity): PreparerBase;
};
/**
 * Location where documentation files are stored
 * @public
 */
export declare type RemoteProtocol = 'url' | 'dir';
