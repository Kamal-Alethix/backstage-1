/// <reference types="react" />
import { GithubDeployment } from '../../api';
import { TableColumn } from '@backstage/core-components';
export declare const GithubStateIndicator: (props: {
    state: string;
}) => JSX.Element;
export declare function createEnvironmentColumn(): TableColumn<GithubDeployment>;
export declare function createStatusColumn(): TableColumn<GithubDeployment>;
export declare function createCommitColumn(): TableColumn<GithubDeployment>;
export declare function createCreatorColumn(): TableColumn<GithubDeployment>;
export declare function createLastUpdatedColumn(): TableColumn<GithubDeployment>;
