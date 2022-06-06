/// <reference types="react" />
import { ComponentConfig, PromoteRcOnSuccessArgs } from '../../types/types';
import { GetLatestReleaseResult } from '../../api/GitReleaseClient';
interface PromoteRcBodyProps {
    rcRelease: NonNullable<GetLatestReleaseResult['latestRelease']>;
    onSuccess?: ComponentConfig<PromoteRcOnSuccessArgs>['onSuccess'];
}
export declare const PromoteRcBody: ({ rcRelease, onSuccess }: PromoteRcBodyProps) => JSX.Element;
export {};
