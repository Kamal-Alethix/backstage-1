/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { IconComponent } from '@backstage/core-plugin-api';

/**
 * @public
 */
declare const codescenePlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
    projectPage: _backstage_core_plugin_api.RouteRef<{
        projectId: string;
    }>;
}, {}>;
/**
 * @public
 */
declare const CodeScenePage: () => JSX.Element;
/**
 * @public
 */
declare const CodeSceneProjectDetailsPage: () => JSX.Element;

/**
 * @public
 */
declare const CodeSceneIcon: IconComponent;

export { CodeSceneIcon, CodeScenePage, CodeSceneProjectDetailsPage, codescenePlugin };
