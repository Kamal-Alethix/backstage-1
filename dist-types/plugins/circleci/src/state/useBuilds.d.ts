/// <reference types="react" />
import { BuildSummary, GitType } from 'circleci-api';
import type { CITableBuildInfo } from '../components/BuildsPage/lib/CITable';
export declare const transform: (buildsData: BuildSummary[], restartBuild: (buildId: number) => Promise<void>) => CITableBuildInfo[];
export declare const useProjectSlugFromEntity: () => {
    vcs: string;
    owner: string;
    repo: string;
};
export declare function mapVcsType(vcs: string): GitType;
export declare function useBuilds(): readonly [{
    readonly page: number;
    readonly pageSize: number;
    readonly loading: boolean;
    readonly value: CITableBuildInfo[] | undefined;
    readonly projectName: string;
    readonly total: number;
}, {
    readonly getBuilds: ({ limit, offset }: {
        limit: number;
        offset: number;
    }) => Promise<import("circleci-api").BuildSummaryResponse>;
    readonly setPage: import("react").Dispatch<import("react").SetStateAction<number>>;
    readonly setPageSize: import("react").Dispatch<import("react").SetStateAction<number>>;
    readonly restartBuild: (buildId: number) => Promise<void>;
    readonly retry: (() => void) | (() => void) | (() => void) | (() => void);
}];
