interface BuildBackendOptions {
    targetDir: string;
    skipBuildDependencies: boolean;
}
export declare function buildBackend(options: BuildBackendOptions): Promise<void>;
export {};
