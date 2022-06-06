/// <reference types="react" />
import { GithubDeployment } from '../../api';
import * as columnFactories from './columns';
import { TableColumn } from '@backstage/core-components';
declare type GithubDeploymentsTableProps = {
    deployments: GithubDeployment[];
    isLoading: boolean;
    reload: () => void;
    columns: TableColumn<GithubDeployment>[];
};
export declare function GithubDeploymentsTable(props: GithubDeploymentsTableProps): JSX.Element;
export declare namespace GithubDeploymentsTable {
    var columns: typeof columnFactories;
    var defaultDeploymentColumns: TableColumn<GithubDeployment>[];
}
export {};
