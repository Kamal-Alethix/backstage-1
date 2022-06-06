/// <reference types="node" />
export declare type LogFunc = (data: Buffer) => void;
export declare type LogPipe = (dst: NodeJS.WriteStream) => LogFunc;
export declare type LogOptions = {
    prefix?: string;
    forwardClearTerm?: boolean;
};
export declare function createLogPipe(options?: LogOptions): LogPipe;
export declare function createLogFunc(dst: NodeJS.WriteStream, options?: LogOptions): LogFunc;
export declare function trimClearTerm(msg: string): string;
