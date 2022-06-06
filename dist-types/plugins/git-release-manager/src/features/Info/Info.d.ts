/// <reference types="react" />
import { GetBranchResult, GetLatestReleaseResult } from '../../api/GitReleaseClient';
interface InfoCardProps {
    releaseBranch: GetBranchResult['branch'] | null;
    latestRelease: GetLatestReleaseResult['latestRelease'];
    statsEnabled: boolean;
}
export declare const Info: ({ releaseBranch, latestRelease, statsEnabled, }: InfoCardProps) => JSX.Element;
export {};
