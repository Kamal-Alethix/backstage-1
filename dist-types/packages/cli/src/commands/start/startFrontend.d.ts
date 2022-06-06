interface StartAppOptions {
    verifyVersions?: boolean;
    entry: string;
    checksEnabled: boolean;
    configPaths: string[];
}
export declare function startFrontend(options: StartAppOptions): Promise<void>;
export {};
