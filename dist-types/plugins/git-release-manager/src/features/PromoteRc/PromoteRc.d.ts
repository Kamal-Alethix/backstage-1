/// <reference types="react" />
import { ComponentConfig, PromoteRcOnSuccessArgs } from '../../types/types';
import { GetLatestReleaseResult } from '../../api/GitReleaseClient';
interface PromoteRcProps {
    latestRelease: GetLatestReleaseResult['latestRelease'];
    onSuccess?: ComponentConfig<PromoteRcOnSuccessArgs>['onSuccess'];
}
export declare const PromoteRc: ({ latestRelease, onSuccess }: PromoteRcProps) => JSX.Element;
export {};
