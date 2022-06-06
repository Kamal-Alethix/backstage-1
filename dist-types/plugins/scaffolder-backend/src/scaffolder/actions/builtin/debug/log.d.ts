/**
 * Writes a message into the log or lists all files in the workspace
 *
 * @remarks
 *
 * This task is useful for local development and testing of both the scaffolder
 * and scaffolder templates.
 *
 * @public
 */
export declare function createDebugLogAction(): import("../..").TemplateAction<{
    message?: string | undefined;
    listWorkspace?: boolean | undefined;
}>;
export declare function recursiveReadDir(dir: string): Promise<string[]>;
