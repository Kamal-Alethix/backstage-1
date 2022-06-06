/// <reference types="react" />
export interface ReleaseStats {
    unmappableTags: string[];
    unmatchedTags: string[];
    unmatchedReleases: string[];
    releases: {
        [baseVersion: string]: {
            baseVersion: string;
            createdAt: string | null;
            htmlUrl: string;
            candidates: {
                tagName: string;
                tagSha: string;
                tagType: 'tag' | 'commit';
            }[];
            versions: {
                tagName: string;
                tagSha: string;
                tagType: 'tag' | 'commit';
            }[];
        };
    };
}
export declare const ReleaseStatsContext: import("react").Context<{
    releaseStats: ReleaseStats;
} | undefined>;
export declare const useReleaseStatsContext: () => {
    releaseStats: ReleaseStats;
};
