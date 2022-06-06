/// <reference types="react" />
import { V1Deployment } from '@kubernetes/client-node';
export declare const DeploymentDrawer: ({ deployment, expanded, }: {
    deployment: V1Deployment;
    expanded?: boolean | undefined;
}) => JSX.Element;
