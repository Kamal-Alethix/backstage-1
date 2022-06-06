/// <reference types="react" />
/**
 * @public
 */
export declare const techInsightsPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    root: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {}>;
/**
 * @public
 */
export declare const EntityTechInsightsScorecardContent: ({ title, description, checksId, }: {
    title?: string | undefined;
    description?: string | undefined;
    checksId?: string[] | undefined;
}) => JSX.Element;
/**
 * @public
 */
export declare const EntityTechInsightsScorecardCard: ({ title, description, checksId, }: {
    title?: string | undefined;
    description?: string | undefined;
    checksId?: string[] | undefined;
}) => JSX.Element;
