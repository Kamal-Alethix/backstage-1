import { GetBranchResult, GetLatestReleaseResult, GetRecentCommitsResultSingle, GetTagResult, GetCommitResult } from '../api/GitReleaseClient';
import { CalverTagParts } from '../helpers/tagParts/getCalverTagParts';
import { Project } from '../contexts/ProjectContext';
import { getReleaseCandidateGitInfo } from '../helpers/getReleaseCandidateGitInfo';
export declare const mockUsername = "mock_username";
export declare const mockEmail = "mock_email";
export declare const mockOwner = "mock_owner";
export declare const mockRepo = "mock_repo";
export declare const A_CALVER_VERSION = "2020.01.01_1";
export declare const MOCK_RELEASE_NAME_CALVER: string;
export declare const MOCK_RELEASE_BRANCH_NAME_CALVER: string;
export declare const MOCK_RELEASE_CANDIDATE_TAG_NAME_CALVER: string;
export declare const MOCK_RELEASE_VERSION_TAG_NAME_CALVER: string;
export declare const A_SEMVER_VERSION = "1.2.3";
export declare const MOCK_RELEASE_NAME_SEMVER: string;
export declare const MOCK_RELEASE_BRANCH_NAME_SEMVER: string;
export declare const MOCK_RELEASE_CANDIDATE_TAG_NAME_SEMVER: string;
export declare const MOCK_RELEASE_VERSION_TAG_NAME_SEMVER: string;
export declare const createMockTag: (overrides: Partial<GetTagResult['tag']>) => GetTagResult;
export declare const createMockCommit: (overrides: Partial<GetCommitResult['commit']>) => GetCommitResult;
export declare const mockUser: {
    username: string;
    email: string;
};
export declare const mockSemverProject: Project;
export declare const mockCalverProject: Project;
export declare const mockSearchCalver: string;
export declare const mockSearchSemver: string;
export declare const mockDefaultBranch = "mock_defaultBranch";
export declare const mockNextGitInfoSemver: ReturnType<typeof getReleaseCandidateGitInfo>;
export declare const mockNextGitInfoCalver: ReturnType<typeof getReleaseCandidateGitInfo>;
export declare const mockTagParts: CalverTagParts;
export declare const mockCtaMessage = "Patch Release Candidate";
export declare const mockBumpedTag = "rc-2020.01.01_1337";
/**
 * MOCK RELEASE
 */
export declare const createMockRelease: ({ id, prerelease, ...rest }?: Partial<NonNullable<GetLatestReleaseResult['latestRelease']>>) => NonNullable<GetLatestReleaseResult['latestRelease']>;
export declare const mockReleaseCandidateCalver: {
    targetCommitish: string;
    tagName: string;
    prerelease: boolean;
    id: number;
    htmlUrl: string;
    body?: string | null | undefined;
};
export declare const mockReleaseVersionCalver: {
    targetCommitish: string;
    tagName: string;
    prerelease: boolean;
    id: number;
    htmlUrl: string;
    body?: string | null | undefined;
};
export declare const mockReleaseCandidateSemver: {
    targetCommitish: string;
    tagName: string;
    prerelease: boolean;
    id: number;
    htmlUrl: string;
    body?: string | null | undefined;
};
export declare const mockReleaseVersionSemver: {
    targetCommitish: string;
    tagName: string;
    prerelease: boolean;
    id: number;
    htmlUrl: string;
    body?: string | null | undefined;
};
/**
 * MOCK BRANCH
 */
export declare const createMockBranch: ({ ...rest }?: Partial<GetBranchResult>) => GetBranchResult['branch'];
export declare const mockReleaseBranch: {
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
/**
 * MOCK COMMIT
 */
export declare const createMockRecentCommit: ({ ...rest }: Partial<GetRecentCommitsResultSingle>) => GetRecentCommitsResultSingle;
export declare const mockSelectedPatchCommit: {
    htmlUrl: string;
    sha: string;
    author: {
        htmlUrl?: string | undefined;
        login?: string | undefined;
    };
    commit: {
        message: string;
    };
    firstParentSha?: string | undefined;
};
