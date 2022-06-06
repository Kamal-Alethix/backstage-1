/// <reference types="react" />
import * as _backstage_core_components from '@backstage/core-components';
import { TableColumn } from '@backstage/core-components';
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';

declare type Node = {
    logUrl?: string;
};
declare type GithubDeployment = {
    environment: string;
    state: string;
    updatedAt: string;
    commit: {
        abbreviatedOid: string;
        commitUrl: string;
    } | null;
    statuses: {
        nodes: Node[];
    };
    creator: {
        login: string;
    };
    repository: {
        nameWithOwner: string;
    };
    payload: string;
};

declare const githubDeploymentsPlugin: _backstage_core_plugin_api.BackstagePlugin<{}, {}>;
declare const EntityGithubDeploymentsCard: (props: {
    last?: number | undefined;
    lastStatuses?: number | undefined;
    columns?: _backstage_core_components.TableColumn<GithubDeployment>[] | undefined;
}) => JSX.Element;

declare const GithubStateIndicator: (props: {
    state: string;
}) => JSX.Element;
declare function createEnvironmentColumn(): TableColumn<GithubDeployment>;
declare function createStatusColumn(): TableColumn<GithubDeployment>;
declare function createCommitColumn(): TableColumn<GithubDeployment>;
declare function createCreatorColumn(): TableColumn<GithubDeployment>;
declare function createLastUpdatedColumn(): TableColumn<GithubDeployment>;

declare const columnFactories_GithubStateIndicator: typeof GithubStateIndicator;
declare const columnFactories_createEnvironmentColumn: typeof createEnvironmentColumn;
declare const columnFactories_createStatusColumn: typeof createStatusColumn;
declare const columnFactories_createCommitColumn: typeof createCommitColumn;
declare const columnFactories_createCreatorColumn: typeof createCreatorColumn;
declare const columnFactories_createLastUpdatedColumn: typeof createLastUpdatedColumn;
declare namespace columnFactories {
  export {
    columnFactories_GithubStateIndicator as GithubStateIndicator,
    columnFactories_createEnvironmentColumn as createEnvironmentColumn,
    columnFactories_createStatusColumn as createStatusColumn,
    columnFactories_createCommitColumn as createCommitColumn,
    columnFactories_createCreatorColumn as createCreatorColumn,
    columnFactories_createLastUpdatedColumn as createLastUpdatedColumn,
  };
}

declare type GithubDeploymentsTableProps = {
    deployments: GithubDeployment[];
    isLoading: boolean;
    reload: () => void;
    columns: TableColumn<GithubDeployment>[];
};
declare function GithubDeploymentsTable(props: GithubDeploymentsTableProps): JSX.Element;
declare namespace GithubDeploymentsTable {
    var columns: typeof columnFactories;
    var defaultDeploymentColumns: TableColumn<GithubDeployment>[];
}

declare const isGithubDeploymentsAvailable: (entity: Entity) => boolean;

export { EntityGithubDeploymentsCard, GithubDeploymentsTable, githubDeploymentsPlugin, isGithubDeploymentsAvailable };
