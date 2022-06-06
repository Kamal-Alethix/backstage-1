export declare type ReleaseCommitPairs = Array<{
    baseVersion: string;
    startCommit: {
        tagName: string;
        tagSha: string;
        tagType: 'tag' | 'commit';
    };
    endCommit: {
        tagName: string;
        tagSha: string;
        tagType: 'tag' | 'commit';
    };
}>;
declare type ReleaseTime = {
    version: string;
    daysWithHours: number;
    days: number;
    hours: number;
    startCommitCreatedAt?: string;
    endCommitCreatedAt?: string;
};
export declare function useGetReleaseTimes(): {
    releaseCommitPairs: ReleaseCommitPairs;
    averageReleaseTime: ReleaseTime[];
    progress: number;
    run: () => Promise<void>;
};
export {};
