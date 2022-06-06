import { ReleaseStats } from '../contexts/ReleaseStatsContext';
export declare function getSummary({ releaseStats }: {
    releaseStats: ReleaseStats;
}): {
    summary: {
        totalReleases: number;
        totalCandidatePatches: number;
        totalVersionPatches: number;
    };
};
