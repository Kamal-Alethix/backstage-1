/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';

declare const bazaarPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const BazaarPage: () => JSX.Element;

declare const EntityBazaarInfoCard: () => JSX.Element | null;

declare const SortView: () => JSX.Element;

export { BazaarPage, EntityBazaarInfoCard, SortView, bazaarPlugin };
