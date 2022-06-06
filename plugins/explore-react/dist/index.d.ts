import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';

declare const exploreToolsConfigRef: _backstage_core_plugin_api.ApiRef<ExploreToolsConfig>;
declare type ExploreTool = {
    title: string;
    description?: string;
    url: string;
    image: string;
    tags?: string[];
    lifecycle?: string;
};
interface ExploreToolsConfig {
    getTools: () => Promise<ExploreTool[]>;
}

export { ExploreTool, ExploreToolsConfig, exploreToolsConfigRef };
