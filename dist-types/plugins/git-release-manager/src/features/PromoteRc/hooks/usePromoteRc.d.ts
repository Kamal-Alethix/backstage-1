import { CardHook, ComponentConfig, PromoteRcOnSuccessArgs } from '../../../types/types';
import { GetLatestReleaseResult } from '../../../api/GitReleaseClient';
export interface UsePromoteRc {
    rcRelease: NonNullable<GetLatestReleaseResult['latestRelease']>;
    releaseVersion: string;
    onSuccess?: ComponentConfig<PromoteRcOnSuccessArgs>['onSuccess'];
}
export declare function usePromoteRc({ rcRelease, releaseVersion, onSuccess, }: UsePromoteRc): CardHook<void>;
