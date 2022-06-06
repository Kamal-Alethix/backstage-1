/// <reference types="react" />
import { GetBranchResult, GetLatestReleaseResult, GetRepositoryResult } from '../../api/GitReleaseClient';
import { ComponentConfig, CreateRcOnSuccessArgs } from '../../types/types';
interface CreateReleaseCandidateProps {
    defaultBranch: GetRepositoryResult['repository']['defaultBranch'];
    latestRelease: GetLatestReleaseResult['latestRelease'];
    releaseBranch: GetBranchResult['branch'] | null;
    onSuccess?: ComponentConfig<CreateRcOnSuccessArgs>['onSuccess'];
}
export declare const CreateReleaseCandidate: ({ defaultBranch, latestRelease, releaseBranch, onSuccess, }: CreateReleaseCandidateProps) => JSX.Element;
export {};
