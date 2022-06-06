/// <reference types="react" />
export declare const rootRouteRef: import("@backstage/core-plugin-api").RouteRef<undefined>;
export declare const projectGrowthAlertRef: import("@backstage/core-plugin-api").RouteRef<undefined>;
export declare const unlabeledDataflowAlertRef: import("@backstage/core-plugin-api").RouteRef<undefined>;
export declare const costInsightsPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    root: import("@backstage/core-plugin-api").RouteRef<undefined>;
    growthAlerts: import("@backstage/core-plugin-api").RouteRef<undefined>;
    unlabeledDataflowAlerts: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {}>;
export declare const CostInsightsPage: () => JSX.Element;
export declare const CostInsightsProjectGrowthInstructionsPage: () => JSX.Element;
export declare const CostInsightsLabelDataflowInstructionsPage: () => JSX.Element;
