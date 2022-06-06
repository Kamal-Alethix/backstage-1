import { ScmIntegrationRegistry } from '@backstage/integration';
export declare const getRepoSourceDirectory: (workspacePath: string, sourcePath: string | undefined) => string;
export declare type RepoSpec = {
    repo: string;
    host: string;
    owner?: string;
    organization?: string;
    workspace?: string;
    project?: string;
};
export declare const parseRepoUrl: (repoUrl: string, integrations: ScmIntegrationRegistry) => RepoSpec;
export declare const isExecutable: (fileMode: number) => boolean;
