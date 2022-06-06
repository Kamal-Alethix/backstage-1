import { GitReleaseApi } from '../api/GitReleaseClient';
import { Project } from '../contexts/ProjectContext';
interface GetGitBatchInfo {
    project: Project;
    pluginApiClient: GitReleaseApi;
}
export declare const useGetGitBatchInfo: ({ project, pluginApiClient, }: GetGitBatchInfo) => {
    gitBatchInfo: {
        loading: boolean;
        error?: undefined;
        value?: undefined;
    } | {
        loading: false;
        error: Error;
        value?: undefined;
    } | {
        loading: true;
        error?: Error | undefined;
        value?: {
            latestRelease: null;
            releaseBranch: null;
            repository: {
                pushPermissions: boolean | undefined;
                defaultBranch: string;
                name: string;
            };
        } | {
            latestRelease: {
                targetCommitish: string;
                tagName: string;
                prerelease: boolean;
                id: number;
                htmlUrl: string;
                body?: string | null | undefined;
            };
            releaseBranch: {
                name: string;
                links: {
                    html: string;
                };
                commit: {
                    sha: string;
                    commit: {
                        tree: {
                            sha: string;
                        };
                    };
                };
            };
            repository: {
                pushPermissions: boolean | undefined;
                defaultBranch: string;
                name: string;
            };
        } | undefined;
    } | {
        loading: false;
        error?: undefined;
        value: {
            latestRelease: null;
            releaseBranch: null;
            repository: {
                pushPermissions: boolean | undefined;
                defaultBranch: string;
                name: string;
            };
        } | {
            latestRelease: {
                targetCommitish: string;
                tagName: string;
                prerelease: boolean;
                id: number;
                htmlUrl: string;
                body?: string | null | undefined;
            };
            releaseBranch: {
                name: string;
                links: {
                    html: string;
                };
                commit: {
                    sha: string;
                    commit: {
                        tree: {
                            sha: string;
                        };
                    };
                };
            };
            repository: {
                pushPermissions: boolean | undefined;
                defaultBranch: string;
                name: string;
            };
        };
    };
    fetchGitBatchInfo: () => Promise<{
        latestRelease: null;
        releaseBranch: null;
        repository: {
            pushPermissions: boolean | undefined;
            defaultBranch: string;
            name: string;
        };
    } | {
        latestRelease: {
            targetCommitish: string;
            tagName: string;
            prerelease: boolean;
            id: number;
            htmlUrl: string;
            body?: string | null | undefined;
        };
        releaseBranch: {
            name: string;
            links: {
                html: string;
            };
            commit: {
                sha: string;
                commit: {
                    tree: {
                        sha: string;
                    };
                };
            };
        };
        repository: {
            pushPermissions: boolean | undefined;
            defaultBranch: string;
            name: string;
        };
    }>;
};
export {};
