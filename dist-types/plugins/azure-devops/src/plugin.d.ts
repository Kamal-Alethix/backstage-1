/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
export declare const isAzureDevOpsAvailable: (entity: Entity) => boolean;
export declare const isAzurePipelinesAvailable: (entity: Entity) => boolean;
export declare const azureDevOpsPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{}, {}>;
export declare const AzurePullRequestsPage: ({ projectName, pollingInterval, defaultColumnConfigs, }: {
    projectName?: string | undefined;
    pollingInterval?: number | undefined;
    defaultColumnConfigs?: import("./components/PullRequestsPage").PullRequestColumnConfig[] | undefined;
}) => JSX.Element;
export declare const EntityAzurePipelinesContent: ({ defaultLimit, }: {
    defaultLimit?: number | undefined;
}) => JSX.Element;
export declare const EntityAzureGitTagsContent: () => JSX.Element;
export declare const EntityAzurePullRequestsContent: ({ defaultLimit, }: {
    defaultLimit?: number | undefined;
}) => JSX.Element;
