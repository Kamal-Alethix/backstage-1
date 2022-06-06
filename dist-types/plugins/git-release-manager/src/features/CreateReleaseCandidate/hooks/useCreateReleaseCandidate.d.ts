import { GetLatestReleaseResult, GetRepositoryResult } from '../../../api/GitReleaseClient';
import { CardHook, ComponentConfig, CreateRcOnSuccessArgs } from '../../../types/types';
import { getReleaseCandidateGitInfo } from '../../../helpers/getReleaseCandidateGitInfo';
import { Project } from '../../../contexts/ProjectContext';
export interface UseCreateReleaseCandidate {
    defaultBranch: GetRepositoryResult['repository']['defaultBranch'];
    latestRelease: GetLatestReleaseResult['latestRelease'];
    releaseCandidateGitInfo: ReturnType<typeof getReleaseCandidateGitInfo>;
    project: Project;
    onSuccess?: ComponentConfig<CreateRcOnSuccessArgs>['onSuccess'];
}
export declare function useCreateReleaseCandidate({ defaultBranch, latestRelease, releaseCandidateGitInfo, project, onSuccess, }: UseCreateReleaseCandidate): CardHook<void>;
