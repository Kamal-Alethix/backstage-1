/**
 * Hook to expose a specific build.
 * @param jobFullName - the full name of the project (job with builds, not a folder). e.g. "department-A/team-1/project-foo/master"
 * @param buildNumber - the number of the build. e.g. "13"
 */
export declare function useBuildWithSteps({ jobFullName, buildNumber, }: {
    jobFullName: string;
    buildNumber: string;
}): readonly [{
    readonly loading: boolean;
    readonly value: import("../api/JenkinsApi").Build | undefined;
    readonly retry: (() => void) | (() => void) | (() => void) | (() => void);
}, {
    readonly getBuildWithSteps: () => Promise<import("../api/JenkinsApi").Build>;
    readonly startPolling: () => Promise<void>;
    readonly stopPolling: () => void;
}];
