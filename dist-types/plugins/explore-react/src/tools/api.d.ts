export declare const exploreToolsConfigRef: import("@backstage/core-plugin-api").ApiRef<ExploreToolsConfig>;
export declare type ExploreTool = {
    title: string;
    description?: string;
    url: string;
    image: string;
    tags?: string[];
    lifecycle?: string;
};
export interface ExploreToolsConfig {
    getTools: () => Promise<ExploreTool[]>;
}
