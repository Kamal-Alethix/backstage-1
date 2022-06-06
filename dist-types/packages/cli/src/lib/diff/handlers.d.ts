import { FileDiff, PromptFunc, FileHandler, WriteFileFunc } from './types';
declare class PackageJsonHandler {
    private readonly writeFunc;
    private readonly prompt;
    private readonly pkg;
    private readonly targetPkg;
    private readonly variant?;
    static handler({ path, write, missing, targetContents, templateContents }: FileDiff, prompt: PromptFunc, variant?: string): Promise<void>;
    static appHandler(file: FileDiff, prompt: PromptFunc): Promise<void>;
    constructor(writeFunc: WriteFileFunc, prompt: PromptFunc, pkg: any, targetPkg: any, variant?: string | undefined);
    handle(): Promise<void>;
    private syncField;
    private syncFiles;
    private syncScripts;
    private syncPublishConfig;
    private syncDependencies;
    private syncReactDeps;
    private write;
}
declare function exactMatchHandler({ path, write, missing, targetContents, templateContents }: FileDiff, prompt: PromptFunc): Promise<void>;
declare function existsHandler({ path, write, missing, templateContents }: FileDiff, prompt: PromptFunc): Promise<void>;
declare function skipHandler({ path }: FileDiff): Promise<void>;
export declare const handlers: {
    skip: typeof skipHandler;
    exists: typeof existsHandler;
    exactMatch: typeof exactMatchHandler;
    packageJson: typeof PackageJsonHandler.handler;
    appPackageJson: typeof PackageJsonHandler.appHandler;
};
export declare function handleAllFiles(fileHandlers: FileHandler[], files: FileDiff[], promptFunc: PromptFunc): Promise<void>;
export {};
