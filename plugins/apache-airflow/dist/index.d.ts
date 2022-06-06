/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';

declare const apacheAirflowPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const ApacheAirflowPage: () => JSX.Element;

export { ApacheAirflowPage, apacheAirflowPlugin };
