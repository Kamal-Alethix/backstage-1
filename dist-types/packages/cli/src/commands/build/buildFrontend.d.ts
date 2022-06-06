interface BuildAppOptions {
    targetDir: string;
    writeStats: boolean;
    configPaths: string[];
}
export declare function buildFrontend(options: BuildAppOptions): Promise<void>;
export {};
