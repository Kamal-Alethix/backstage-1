/**
 * A function that takes a set of path fragments and resolves them into a
 * single complete path, relative to some root.
 *
 * @public
 */
export declare type ResolveFunc = (...paths: string[]) => string;
/**
 * Common paths and resolve functions used by the cli.
 * Currently assumes it is being executed within a monorepo.
 *
 * @public
 */
export declare type Paths = {
    ownDir: string;
    ownRoot: string;
    targetDir: string;
    targetRoot: string;
    resolveOwn: ResolveFunc;
    resolveOwnRoot: ResolveFunc;
    resolveTarget: ResolveFunc;
    resolveTargetRoot: ResolveFunc;
};
export declare function findRootPath(searchDir: string, filterFunc: (pkgJsonPath: string) => boolean): string | undefined;
export declare function findOwnDir(searchDir: string): string;
export declare function findOwnRootDir(ownDir: string): string;
/**
 * Find paths related to a package and its execution context.
 *
 * @public
 * @example
 *
 * const paths = findPaths(__dirname)
 */
export declare function findPaths(searchDir: string): Paths;
/**
 * The name of the backstage's config file
 *
 * @public
 */
export declare const BACKSTAGE_JSON = "backstage.json";
