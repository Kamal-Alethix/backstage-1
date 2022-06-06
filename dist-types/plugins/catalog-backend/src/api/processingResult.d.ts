import { Entity } from '@backstage/catalog-model';
import { CatalogProcessorResult } from './processor';
import { EntityRelationSpec, LocationSpec } from './common';
/**
 * Factory functions for the standard processing result types.
 *
 * @public
 */
export declare const processingResult: Readonly<{
    readonly notFoundError: (atLocation: LocationSpec, message: string) => CatalogProcessorResult;
    readonly inputError: (atLocation: LocationSpec, message: string) => CatalogProcessorResult;
    readonly generalError: (atLocation: LocationSpec, message: string) => CatalogProcessorResult;
    readonly location: (newLocation: LocationSpec) => CatalogProcessorResult;
    readonly entity: (atLocation: LocationSpec, newEntity: Entity) => CatalogProcessorResult;
    readonly relation: (spec: EntityRelationSpec) => CatalogProcessorResult;
}>;
