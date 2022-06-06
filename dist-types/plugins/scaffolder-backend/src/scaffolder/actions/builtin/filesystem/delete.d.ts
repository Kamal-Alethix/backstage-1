/**
 * Creates new action that enables deletion of files and directories in the workspace.
 * @public
 */
export declare const createFilesystemDeleteAction: () => import("../..").TemplateAction<{
    files: string[];
}>;
