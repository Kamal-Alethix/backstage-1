import { ReleaseCommitPairs } from '../hooks/useGetReleaseTimes';
import { ReleaseStats } from '../../contexts/ReleaseStatsContext';
export declare function getReleaseCommitPairs({ releaseStats, }: {
    releaseStats: ReleaseStats;
}): {
    releaseCommitPairs: ReleaseCommitPairs;
};
