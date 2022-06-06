/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
/**
 * Constant storing GoCD pipelines annotation.
 *
 * @public
 */
export declare const GOCD_PIPELINES_ANNOTATION = "gocd.org/pipelines";
/**
 * Returns true if GoCD annotation is present in the given entity.
 *
 * @public
 */
export declare const isGoCdAvailable: (entity: Entity) => boolean;
export declare const GoCdBuildsComponent: () => JSX.Element;
