/// <reference types="react" />
declare type BitriseBuildsProps = {
    appName: string;
    workflow?: string;
    error?: Error | undefined;
};
export declare const BitriseBuildsTable: ({ appName, workflow, error, }: BitriseBuildsProps) => JSX.Element;
export {};
