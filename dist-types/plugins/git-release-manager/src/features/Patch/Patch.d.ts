/// <reference types="react" />
import { GetBranchResult, GetLatestReleaseResult } from '../../api/GitReleaseClient';
import { ComponentConfig, PatchOnSuccessArgs } from '../../types/types';
interface PatchProps {
    latestRelease: GetLatestReleaseResult['latestRelease'];
    releaseBranch: GetBranchResult['branch'] | null;
    onSuccess?: ComponentConfig<PatchOnSuccessArgs>['onSuccess'];
}
export declare const Patch: ({ latestRelease, releaseBranch, onSuccess, }: PatchProps) => JSX.Element;
export {};
