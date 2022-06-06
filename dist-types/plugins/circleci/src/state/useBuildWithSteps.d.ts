export declare function useBuildWithSteps(buildId: number): readonly [{
    readonly loading: boolean;
    readonly value: import("circleci-api/dist/types/src/types/api").BuildWithSteps | undefined;
    readonly retry: (() => void) | (() => void) | (() => void) | (() => void);
}, {
    readonly restartBuild: () => Promise<void>;
    readonly getBuildWithSteps: () => Promise<import("circleci-api/dist/types/src/types/api").BuildWithSteps>;
    readonly startPolling: () => Promise<void>;
    readonly stopPolling: () => void;
}];
