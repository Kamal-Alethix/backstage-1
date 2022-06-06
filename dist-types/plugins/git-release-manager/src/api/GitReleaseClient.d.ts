import { Project } from '../contexts/ProjectContext';
import { UnboxArray, UnboxReturnedPromise } from '../types/helpers';
import { ConfigApi, OAuthApi } from '@backstage/core-plugin-api';
export declare class GitReleaseClient implements GitReleaseApi {
    private readonly githubAuthApi;
    private readonly apiBaseUrl;
    readonly host: string;
    constructor({ configApi, githubAuthApi, }: {
        configApi: ConfigApi;
        githubAuthApi: OAuthApi;
    });
    private getGithubIntegrationConfig;
    private getOctokit;
    getHost: GitReleaseApi['getHost'];
    getRepoPath: GitReleaseApi['getRepoPath'];
    getOwners: GitReleaseApi['getOwners'];
    getRepositories: GitReleaseApi['getRepositories'];
    getUser: GitReleaseApi['getUser'];
    getRecentCommits: GitReleaseApi['getRecentCommits'];
    getLatestRelease: GitReleaseApi['getLatestRelease'];
    getRepository: GitReleaseApi['getRepository'];
    getCommit: GitReleaseApi['getCommit'];
    getBranch: GitReleaseApi['getBranch'];
    createRef: GitReleaseApi['createRef'];
    deleteRef: GitReleaseApi['deleteRef'];
    getComparison: GitReleaseApi['getComparison'];
    createRelease: GitReleaseApi['createRelease'];
    createTagObject: GitReleaseApi['createTagObject'];
    createCommit: GitReleaseApi['createCommit'];
    updateRef: GitReleaseApi['updateRef'];
    merge: GitReleaseApi['merge'];
    updateRelease: GitReleaseApi['updateRelease'];
    getAllTags: GitReleaseApi['getAllTags'];
    getAllReleases: GitReleaseApi['getAllReleases'];
    getTag: GitReleaseApi['getTag'];
}
declare type OwnerRepo = {
    owner: Project['owner'];
    repo: Project['repo'];
};
export interface GitReleaseApi {
    getHost: () => string;
    getRepoPath: (args: OwnerRepo) => string;
    getOwners: () => Promise<{
        owners: string[];
    }>;
    getRepositories: (args: {
        owner: OwnerRepo['owner'];
    }) => Promise<{
        repositories: string[];
    }>;
    getUser: (args: OwnerRepo) => Promise<{
        user: {
            username: string;
            email?: string;
        };
    }>;
    getRecentCommits: (args: {
        releaseBranchName?: string;
    } & OwnerRepo) => Promise<{
        recentCommits: {
            htmlUrl: string;
            sha: string;
            author: {
                htmlUrl?: string;
                login?: string;
            };
            commit: {
                message: string;
            };
            firstParentSha?: string;
        }[];
    }>;
    getLatestRelease: (args: OwnerRepo) => Promise<{
        latestRelease: {
            targetCommitish: string;
            tagName: string;
            prerelease: boolean;
            id: number;
            htmlUrl: string;
            body?: string | null;
        } | null;
    }>;
    getRepository: (args: OwnerRepo) => Promise<{
        repository: {
            pushPermissions: boolean | undefined;
            defaultBranch: string;
            name: string;
        };
    }>;
    getCommit: (args: {
        ref: string;
    } & OwnerRepo) => Promise<{
        commit: {
            sha: string;
            htmlUrl: string;
            commit: {
                message: string;
            };
            createdAt?: string;
        };
    }>;
    getBranch: (args: {
        branch: string;
    } & OwnerRepo) => Promise<{
        branch: {
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
    }>;
    createRef: (args: {
        ref: string;
        sha: string;
    } & OwnerRepo) => Promise<{
        reference: {
            ref: string;
            objectSha: string;
        };
    }>;
    deleteRef: (args: {
        ref: string;
    } & OwnerRepo) => Promise<{
        success: boolean;
    }>;
    getComparison: (args: {
        base: string;
        head: string;
    } & OwnerRepo) => Promise<{
        comparison: {
            htmlUrl: string;
            aheadBy: number;
        };
    }>;
    createRelease: (args: {
        tagName: string;
        name: string;
        targetCommitish: string;
        body: string;
    } & OwnerRepo) => Promise<{
        release: {
            name: string | null;
            htmlUrl: string;
            tagName: string;
        };
    }>;
    createTagObject: (args: {
        tag: string;
        taggerEmail?: string;
        message: string;
        object: string;
        taggerName: string;
    } & OwnerRepo) => Promise<{
        tagObject: {
            tagName: string;
            tagSha: string;
        };
    }>;
    createCommit: (args: {
        message: string;
        tree: string;
        parents: string[];
    } & OwnerRepo) => Promise<{
        commit: {
            message: string;
            sha: string;
        };
    }>;
    updateRef: (args: {
        sha: string;
        ref: string;
        force: boolean;
    } & OwnerRepo) => Promise<{
        reference: {
            ref: string;
            object: {
                sha: string;
            };
        };
    }>;
    merge: (args: {
        base: string;
        head: string;
    } & OwnerRepo) => Promise<{
        merge: {
            htmlUrl: string;
            commit: {
                message: string;
                tree: {
                    sha: string;
                };
            };
        };
    }>;
    updateRelease: (args: {
        releaseId: number;
        tagName: string;
        body?: string;
        prerelease?: boolean;
    } & OwnerRepo) => Promise<{
        release: {
            name: string | null;
            tagName: string;
            htmlUrl: string;
        };
    }>;
    /**
     * Get all tags in descending order
     */
    getAllTags: (args: OwnerRepo) => Promise<{
        tags: Array<{
            tagName: string;
            tagSha: string;
            tagType: 'tag' | 'commit';
        }>;
    }>;
    getAllReleases: (args: OwnerRepo) => Promise<{
        releases: Array<{
            id: number;
            name: string | null;
            tagName: string;
            createdAt: string | null;
            htmlUrl: string;
        }>;
    }>;
    getTag: (args: {
        tagSha: string;
    } & OwnerRepo) => Promise<{
        tag: {
            date: string;
            username: string;
            userEmail: string;
            objectSha: string;
        };
    }>;
}
export declare type GetOwnersResult = UnboxReturnedPromise<GitReleaseApi['getOwners']>;
export declare type GetRepositoriesResult = UnboxReturnedPromise<GitReleaseApi['getRepositories']>;
export declare type GetUserResult = UnboxReturnedPromise<GitReleaseApi['getUser']>;
export declare type GetRecentCommitsResult = UnboxReturnedPromise<GitReleaseApi['getRecentCommits']>;
export declare type GetRecentCommitsResultSingle = UnboxArray<GetRecentCommitsResult['recentCommits']>;
export declare type GetLatestReleaseResult = UnboxReturnedPromise<GitReleaseApi['getLatestRelease']>;
export declare type GetRepositoryResult = UnboxReturnedPromise<GitReleaseApi['getRepository']>;
export declare type GetCommitResult = UnboxReturnedPromise<GitReleaseApi['getCommit']>;
export declare type GetBranchResult = UnboxReturnedPromise<GitReleaseApi['getBranch']>;
export declare type CreateRefResult = UnboxReturnedPromise<GitReleaseApi['createRef']>;
export declare type GetComparisonResult = UnboxReturnedPromise<GitReleaseApi['getComparison']>;
export declare type CreateReleaseResult = UnboxReturnedPromise<GitReleaseApi['createRelease']>;
export declare type MergeResult = UnboxReturnedPromise<GitReleaseApi['merge']>;
export declare type CreateTagObjectResult = UnboxReturnedPromise<GitReleaseApi['createTagObject']>;
export declare type UpdateReleaseResult = UnboxReturnedPromise<GitReleaseApi['updateRelease']>;
export declare type GetAllTagsResult = UnboxReturnedPromise<GitReleaseApi['getAllTags']>;
export declare type GetAllReleasesResult = UnboxReturnedPromise<GitReleaseApi['getAllReleases']>;
export declare type GetTagResult = UnboxReturnedPromise<GitReleaseApi['getTag']>;
export {};
