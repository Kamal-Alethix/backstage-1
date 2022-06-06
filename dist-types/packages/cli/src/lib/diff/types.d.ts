export declare type WriteFileFunc = (contents: string) => Promise<void>;
export declare type FileDiff = {
    path: string;
    missing: boolean;
    targetContents: string;
    templateContents: string;
    write: WriteFileFunc;
};
export declare type PromptFunc = (msg: string) => Promise<boolean>;
export declare type HandlerFunc = (file: FileDiff, prompt: PromptFunc) => Promise<void>;
export declare type FileHandler = {
    patterns: Array<string | RegExp>;
    handler: HandlerFunc;
};
