/// <reference types="react" />
export declare const githubActionsPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    entityContent: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {}>;
export declare const EntityGithubActionsContent: () => JSX.Element;
export declare const EntityLatestGithubActionRunCard: ({ branch, variant, }: {
    branch: string;
    variant?: import("@backstage/core-components").InfoCardVariants | undefined;
}) => JSX.Element;
export declare const EntityLatestGithubActionsForBranchCard: ({ branch, variant, }: {
    branch: string;
    variant?: import("@backstage/core-components").InfoCardVariants | undefined;
}) => JSX.Element;
export declare const EntityRecentGithubActionsRunsCard: ({ branch, dense, limit, variant, }: import("./components/Cards/RecentWorkflowRunsCard").Props) => JSX.Element;
