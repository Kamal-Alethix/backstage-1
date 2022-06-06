/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
import { ApiHolder } from '@backstage/core-plugin-api';
/**
 * Returns true if the given entity has any processing errors on it.
 *
 * @public
 */
export declare function hasCatalogProcessingErrors(entity: Entity, context: {
    apis: ApiHolder;
}): Promise<boolean>;
/**
 * Displays a list of errors from the ancestors of the current entity.
 *
 * @public
 */
export declare function EntityProcessingErrorsPanel(): JSX.Element | null;
