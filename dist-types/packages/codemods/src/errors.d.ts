export declare class CustomError extends Error {
    get name(): string;
}
export declare class ExitCodeError extends CustomError {
    readonly code: number;
    constructor(code: number, command?: string);
}
export declare function exitWithError(error: Error): never;
