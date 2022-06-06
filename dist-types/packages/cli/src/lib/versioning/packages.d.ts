export declare type YarnInfoInspectData = {
    name: string;
    'dist-tags': Record<string, string>;
    versions: string[];
    time: {
        [version: string]: string;
    };
};
declare type PkgVersionInfo = {
    range: string;
    name: string;
    location: string;
};
export declare function fetchPackageInfo(name: string): Promise<YarnInfoInspectData>;
/** Map all dependencies in the repo as dependency => dependents */
export declare function mapDependencies(targetDir: string, pattern: string): Promise<Map<string, PkgVersionInfo[]>>;
export {};
