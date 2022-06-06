interface StartBackendOptions {
    checksEnabled: boolean;
    inspectEnabled: boolean;
    inspectBrkEnabled: boolean;
}
export declare function startBackend(options: StartBackendOptions): Promise<void>;
export {};
