import { BuildRun } from '@backstage/plugin-azure-devops-common';
export declare function useBuildRuns(projectName: string, defaultLimit?: number, repoName?: string, definitionName?: string): {
    items?: BuildRun[];
    loading: boolean;
    error?: Error;
};
