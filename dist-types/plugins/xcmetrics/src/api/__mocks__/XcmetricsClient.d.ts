import { Build, BuildCount, BuildError, BuildHost, BuildMetadata, BuildStatusResult, BuildTime, BuildWarning, Target, XcmetricsApi, Xcode } from '../types';
export declare const mockBuild: Build;
export declare const mockBuildCount: BuildCount;
export declare const mockBuildError: BuildError;
export declare const mockBuildHost: BuildHost;
export declare const mockBuildMetadata: BuildMetadata;
export declare const mockBuildTime: BuildTime;
export declare const mockBuildStatus: BuildStatusResult;
export declare const mockBuildWarning: BuildWarning;
export declare const mockTarget: Target;
export declare const mockXcode: Xcode;
export declare const mockBuildResponse: {
    build: Build;
    targets: Target[];
    xcode: Xcode;
};
export declare const XcmetricsClient: XcmetricsApi;
