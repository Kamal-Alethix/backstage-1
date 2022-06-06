/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';

declare const codeCoveragePlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const EntityCodeCoverageContent: () => JSX.Element;

declare const isCodeCoverageAvailable: (entity: Entity) => boolean;
declare const Router: () => JSX.Element;

export { EntityCodeCoverageContent, Router, codeCoveragePlugin, isCodeCoverageAvailable, isCodeCoverageAvailable as isPluginApplicableToEntity };
