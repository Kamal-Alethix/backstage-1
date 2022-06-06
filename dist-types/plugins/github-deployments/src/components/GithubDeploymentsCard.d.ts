/// <reference types="react" />
import { GithubDeployment } from '../api';
import { TableColumn } from '@backstage/core-components';
export declare const GithubDeploymentsCard: (props: {
    last?: number;
    lastStatuses?: number;
    columns?: TableColumn<GithubDeployment>[];
}) => JSX.Element;
