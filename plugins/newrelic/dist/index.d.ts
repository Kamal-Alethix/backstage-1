/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';

declare const newRelicPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const NewRelicPage: () => JSX.Element;

export { NewRelicPage, newRelicPlugin, newRelicPlugin as plugin };
