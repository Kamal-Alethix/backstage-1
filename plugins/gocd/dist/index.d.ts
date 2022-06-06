/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';

/**
 * Plugin definition.
 *
 * @public
 */
declare const gocdPlugin: _backstage_core_plugin_api.BackstagePlugin<{}, {}>;

/**
 * GoCD builds table component.
 *
 * @public
 */
declare const EntityGoCdContent: () => JSX.Element;

/**
 * Constant storing GoCD pipelines annotation.
 *
 * @public
 */
declare const GOCD_PIPELINES_ANNOTATION = "gocd.org/pipelines";
/**
 * Returns true if GoCD annotation is present in the given entity.
 *
 * @public
 */
declare const isGoCdAvailable: (entity: Entity) => boolean;

export { EntityGoCdContent, GOCD_PIPELINES_ANNOTATION, gocdPlugin, isGoCdAvailable };
