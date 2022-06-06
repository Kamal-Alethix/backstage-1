/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
/**
 * Constant storing Periskop project name.
 *
 * @public
 */
export declare const PERISKOP_NAME_ANNOTATION = "periskop.io/service-name";
/**
 * Returns true if Periskop annotation is present in the given entity.
 *
 * @public
 */
export declare const isPeriskopAvailable: (entity: Entity) => boolean;
export declare const EntityPeriskopErrorsCard: () => JSX.Element;
