/// <reference types="react" />
import { DashboardPullRequest } from '@backstage/plugin-azure-devops-common';
declare const _default: {
    title: string;
    component: ({ pullRequest, simplified, }: {
        pullRequest: DashboardPullRequest;
        simplified?: boolean | undefined;
    }) => JSX.Element;
};
export default _default;
export declare const Default: () => JSX.Element;
export declare const Simplified: () => JSX.Element;
