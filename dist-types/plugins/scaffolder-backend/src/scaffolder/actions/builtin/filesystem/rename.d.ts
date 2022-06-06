/**
 * Creates a new action that allows renames of files and directories in the workspace.
 * @public
 */
export declare const createFilesystemRenameAction: () => import("../..").TemplateAction<{
    files: Array<{
        from: string;
        to: string;
        overwrite?: boolean;
    }>;
}>;
