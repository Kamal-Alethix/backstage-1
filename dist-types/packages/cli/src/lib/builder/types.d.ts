export declare enum Output {
    esm = 0,
    cjs = 1,
    types = 2
}
export declare type BuildOptions = {
    logPrefix?: string;
    targetDir?: string;
    outputs: Set<Output>;
    minify?: boolean;
    useApiExtractor?: boolean;
};
