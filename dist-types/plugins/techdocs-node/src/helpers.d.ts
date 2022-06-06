import { UrlReader } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { Logger } from 'winston';
import { PreparerResponse, RemoteProtocol } from './stages/prepare/types';
/**
 * Parsed location annotation
 * @public
 */
export declare type ParsedLocationAnnotation = {
    type: RemoteProtocol;
    target: string;
};
/**
 * Returns a parset locations annotation
 * @public
 * @param annotationName - The name of the annotation in the entity metadata
 * @param entity - A TechDocs entity instance
 */
export declare const parseReferenceAnnotation: (annotationName: string, entity: Entity) => ParsedLocationAnnotation;
/**
 * TechDocs references of type `dir` are relative the source location of the entity.
 * This function transforms relative references to absolute ones, based on the
 * location the entity was ingested from. If the entity was registered by a `url`
 * location, it returns a `url` location with a resolved target that points to the
 * targeted subfolder. If the entity was registered by a `file` location, it returns
 * an absolute `dir` location.
 * @public
 * @param entity - the entity with annotations
 * @param dirAnnotation - the parsed techdocs-ref annotation of type 'dir'
 * @param scmIntegrations - access to the scmIntegration to do url transformations
 * @throws if the entity doesn't specify a `dir` location or is ingested from an unsupported location.
 * @returns the transformed location with an absolute target.
 */
export declare const transformDirLocation: (entity: Entity, dirAnnotation: ParsedLocationAnnotation, scmIntegrations: ScmIntegrationRegistry) => {
    type: 'dir' | 'url';
    target: string;
};
/**
 * Returns a entity reference based on the TechDocs annotation type
 * @public
 * @param entity - A TechDocs instance
 * @param scmIntegration - An implementation for  SCM integration API
 */
export declare const getLocationForEntity: (entity: Entity, scmIntegration: ScmIntegrationRegistry) => ParsedLocationAnnotation;
/**
 * Returns a preparer response {@link PreparerResponse}
 * @public
 * @param reader - Read a tree of files from a repository
 * @param entity - A TechDocs entity instance
 * @param opts - Options for configuring the reader, e.g. logger, etag, etc.
 */
export declare const getDocFilesFromRepository: (reader: UrlReader, entity: Entity, opts?: {
    etag?: string | undefined;
    logger?: Logger | undefined;
} | undefined) => Promise<PreparerResponse>;
