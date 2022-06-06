/// <reference types="react" />
declare type CodeRowProps = {
    lineNumber: number;
    lineContent: string;
    lineHits?: number | null;
};
export declare const CodeRow: ({ lineNumber, lineContent, lineHits, }: CodeRowProps) => JSX.Element;
export {};
