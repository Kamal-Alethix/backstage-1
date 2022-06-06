/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';

/**
 * The Airbrake plugin instance
 *
 * @public
 */
declare const airbrakePlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;

/**
 * This is the widget that shows up on a component page
 *
 * @public
 */
declare const EntityAirbrakeContent: () => JSX.Element;

export { EntityAirbrakeContent, airbrakePlugin };
