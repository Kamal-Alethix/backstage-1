import { isChildPath } from '@backstage/cli-common';
/**
 * Resolve a path relative to the root of a package directory.
 * Additional path arguments are resolved relative to the package dir.
 *
 * This is particularly useful when you want to access assets shipped with
 * your backend plugin package. When doing so, do not forget to include the assets
 * in your published package by adding them to `files` in your `package.json`.
 *
 * @public
 */
export declare function resolvePackagePath(name: string, ...paths: string[]): string;
/**
 * Resolves a target path from a base path while guaranteeing that the result is
 * a path that point to or within the base path. This is useful for resolving
 * paths from user input, as it otherwise opens up for vulnerabilities.
 *
 * @public
 * @param base - The base directory to resolve the path from.
 * @param path - The target path, relative or absolute
 * @returns A path that is guaranteed to point to or within the base path.
 */
export declare function resolveSafeChildPath(base: string, path: string): string;
export { isChildPath };
