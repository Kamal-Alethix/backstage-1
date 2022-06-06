/// <reference types="react" />
export declare enum ErrorType {
    CONNECTION_ERROR = 0,
    NOT_FOUND = 1
}
/**
 * Hook to expose the latest build for all the pipelines/projects for an entity.
 * If `branch` is provided, the latest build for only that branch will be given (but still as a list)
 *
 * TODO: deprecate branch and add a generic filter concept.
 */
export declare function useBuilds({ branch }?: {
    branch?: string;
}): readonly [{
    readonly page: number;
    readonly pageSize: number;
    readonly loading: boolean;
    readonly projects: import("../api/JenkinsApi").Project[] | undefined;
    readonly total: number;
    readonly error: {
        message: string;
        errorType: ErrorType;
    } | undefined;
}, {
    readonly setPage: import("react").Dispatch<import("react").SetStateAction<number>>;
    readonly setPageSize: import("react").Dispatch<import("react").SetStateAction<number>>;
    readonly restartBuild: (jobFullName: string, buildNumber: string) => Promise<void>;
    readonly retry: (() => void) | (() => void) | (() => void) | (() => void);
}];
