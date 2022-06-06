import { GetLatestReleaseResult } from '../api/GitReleaseClient';
import { Project } from '../contexts/ProjectContext';
import { SEMVER_PARTS } from '../constants/constants';
interface GetReleaseCandidateGitInfo {
    project: Project;
    latestRelease: GetLatestReleaseResult['latestRelease'];
    semverBumpLevel: keyof typeof SEMVER_PARTS;
    injectedDate?: string;
}
export declare const getReleaseCandidateGitInfo: ({ project, latestRelease, semverBumpLevel, injectedDate, }: GetReleaseCandidateGitInfo) => {
    rcBranch: string;
    rcReleaseTag: string;
    releaseName: string;
    error?: undefined;
} | {
    error: import("../types/types").AlertError;
    rcBranch?: undefined;
    rcReleaseTag?: undefined;
    releaseName?: undefined;
};
export {};
