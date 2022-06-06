/// <reference types="react" />
import * as _backstage_core_components from '@backstage/core-components';
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';

declare type FossaPageProps = {
    entitiesFilter?: Record<string, string | symbol | (string | symbol)[]>[] | Record<string, string | symbol | (string | symbol)[]> | undefined;
};

declare const EntityFossaCard: ({ variant }: {
    variant?: _backstage_core_components.InfoCardVariants | undefined;
}) => JSX.Element;
declare const FossaPage: ({ entitiesFilter, }: FossaPageProps) => JSX.Element;

declare const fossaPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    fossaOverview: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;

export { EntityFossaCard, FossaPage, FossaPageProps, fossaPlugin };
