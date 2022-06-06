/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';

declare const badgesPlugin: _backstage_core_plugin_api.BackstagePlugin<{}, {}>;
declare const EntityBadgesDialog: ({ open, onClose }: {
    open: boolean;
    onClose?: (() => any) | undefined;
}) => JSX.Element;

export { EntityBadgesDialog, badgesPlugin };
