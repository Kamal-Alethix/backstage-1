export declare type BundlingPathsOptions = {
    entry: string;
    targetDir?: string;
};
export declare function resolveBundlingPaths(options: BundlingPathsOptions): {
    targetHtml: string;
    targetPublic: string | undefined;
    targetPath: string;
    targetRunFile: string | undefined;
    targetDist: string;
    targetAssets: string;
    targetSrc: string;
    targetDev: string;
    targetEntry: string;
    targetTsConfig: string;
    targetPackageJson: string;
    rootNodeModules: string;
    root: string;
};
export declare type BundlingPaths = ReturnType<typeof resolveBundlingPaths>;
