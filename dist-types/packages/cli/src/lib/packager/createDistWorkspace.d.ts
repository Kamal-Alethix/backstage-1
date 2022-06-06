declare type FileEntry = string | {
    src: string;
    dest: string;
};
declare type Options = {
    /**
     * Target directory for the dist workspace, defaults to a temporary directory
     */
    targetDir?: string;
    /**
     * Files to copy into the target workspace.
     *
     * Defaults to ['yarn.lock', 'package.json'].
     */
    files?: FileEntry[];
    /**
     * If set to true, the target packages are built before they are packaged into the workspace.
     */
    buildDependencies?: boolean;
    /**
     * When `buildDependencies` is set, this list of packages will not be built even if they are dependencies.
     */
    buildExcludes?: string[];
    /**
     * Controls amount of parallelism in some build steps.
     */
    parallelism?: number;
    /**
     * If set, creates a skeleton tarball that contains all package.json files
     * with the same structure as the workspace dir.
     */
    skeleton?: 'skeleton.tar' | 'skeleton.tar.gz';
};
/**
 * Uses `yarn pack` to package local packages and unpacks them into a dist workspace.
 * The target workspace will end up containing dist version of each package and
 * will be suitable for packaging e.g. into a docker image.
 *
 * This creates a structure that is functionally similar to if the packages were
 * installed from npm, but uses Yarn workspaces to link to them at runtime.
 */
export declare function createDistWorkspace(packageNames: string[], options?: Options): Promise<string>;
export {};
