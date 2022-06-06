import { Entity } from '@backstage/catalog-model';
export declare type responseHeadersType = {
    'Content-Type': string;
};
/**
 * Some files need special headers to be used correctly by the frontend. This function
 * generates headers in the response to those file requests.
 * @param fileExtension - .html, .css, .js, .png etc.
 */
export declare const getHeadersForFileExtension: (fileExtension: string) => responseHeadersType;
/**
 * Recursively traverse all the sub-directories of a path and return
 * a list of absolute paths of all the files. e.g. tree command in Unix
 *
 * @example
 *
 * /User/username/my_dir
 *     dirA
 *     |   subDirA
 *     |   |   file1
 *     EmptyDir
 *     dirB
 *     |   file2
 *     file3
 *
 * getFileListRecursively('/Users/username/myDir')
 * // returns
 * [
 *   '/User/username/my_dir/dirA/subDirA/file1',
 *   '/User/username/my_dir/dirB/file2',
 *   '/User/username/my_dir/file3'
 * ]
 * @param rootDirPath - Absolute path to the root directory.
 */
export declare const getFileTreeRecursively: (rootDirPath: string) => Promise<string[]>;
/**
 * Takes a posix path and returns a lower-cased version of entity's triplet
 * with the remaining path in posix.
 *
 * Path must not include a starting slash.
 *
 * @example
 * lowerCaseEntityTriplet('default/Component/backstage')
 * // return default/component/backstage
 */
export declare const lowerCaseEntityTriplet: (posixPath: string) => string;
/**
 * Takes either a win32 or posix path and returns a lower-cased version of entity's triplet
 * with the remaining path in posix.
 *
 * Starting slashes will be trimmed.
 *
 * Throws an error if the path does not appear to be an entity triplet.
 *
 * @example
 * lowerCaseEntityTripletInStoragePath('/default/Component/backstage/file.txt')
 * // return default/component/backstage/file.txt
 */
export declare const lowerCaseEntityTripletInStoragePath: (originalPath: string) => string;
/**
 * Take a posix path and return a path without leading and trailing
 * separators
 *
 * @example
 * normalizeExternalStorageRootPath('/backstage-data/techdocs/')
 * // return backstage-data/techdocs
 */
export declare const normalizeExternalStorageRootPath: (posixPath: string) => string;
export declare const getStaleFiles: (newFiles: string[], oldFiles: string[]) => string[];
export declare const getCloudPathForLocalPath: (entity: Entity, localPath?: string, useLegacyPathCasing?: boolean, externalStorageRootPath?: string) => string;
export declare const bulkStorageOperation: <T>(operation: (arg: T) => Promise<unknown>, args: T[], { concurrencyLimit }?: {
    concurrencyLimit: number;
}) => Promise<void>;
