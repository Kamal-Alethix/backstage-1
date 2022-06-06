/// <reference types="react" />
export declare const githubDeploymentsPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{}, {}>;
export declare const EntityGithubDeploymentsCard: (props: {
    last?: number | undefined;
    lastStatuses?: number | undefined;
    columns?: import("@backstage/core-components").TableColumn<import("./api").GithubDeployment>[] | undefined;
}) => JSX.Element;
