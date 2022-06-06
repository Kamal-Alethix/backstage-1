/**
 * This task is useful for local development and testing of both the scaffolder
 * and scaffolder templates.
 *
 * @remarks
 *
 * This action is not installed by default and should not be installed in
 * production, as it writes the files to the local filesystem of the scaffolder.
 *
 * @public
 */
export declare function createPublishFileAction(): import("../..").TemplateAction<{
    path: string;
}>;
