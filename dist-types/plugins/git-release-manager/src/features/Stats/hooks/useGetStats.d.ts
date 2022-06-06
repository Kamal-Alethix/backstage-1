export declare const useGetStats: () => {
    stats: import("react-use/lib/useAsyncFn").AsyncState<{
        allReleases: {
            id: number;
            name: string | null;
            tagName: string;
            createdAt: string | null;
            htmlUrl: string;
        }[];
        allTags: {
            tagName: string;
            tagSha: string;
            tagType: "commit" | "tag";
        }[];
    }>;
};
