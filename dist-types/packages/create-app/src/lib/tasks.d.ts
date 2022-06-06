export declare class Task {
    static log(name?: string): void;
    static error(message?: string): void;
    static section(name: string): void;
    static exit(code?: number): void;
    static forItem(task: string, item: string, taskFunc: () => Promise<void>): Promise<void>;
}
/**
 * Generate a templated backstage project
 *
 * @param templateDir - location containing template files
 * @param destinationDir - location to save templated project
 * @param context - template parameters
 */
export declare function templatingTask(templateDir: string, destinationDir: string, context: any): Promise<void>;
/**
 * Verify that application target does not already exist
 *
 * @param rootDir - The directory to create application folder `name`
 * @param name - The specified name of the application
 * @Throws Error - If directory with name of `destination` already exists
 */
export declare function checkAppExistsTask(rootDir: string, name: string): Promise<void>;
/**
 * Verify that application `path` exists, otherwise create the directory
 *
 * @param path - target to create directory
 * @throws if `path` is a file, or `fs.mkdir` fails
 */
export declare function checkPathExistsTask(path: string): Promise<void>;
/**
 * Create a folder to store templated files
 *
 * @param tempDir - target temporary directory
 * @throws if `fs.mkdir` fails
 */
export declare function createTemporaryAppFolderTask(tempDir: string): Promise<void>;
/**
 * Run `yarn install` and `run tsc` in application directory
 *
 * @param appDir - location of application to build
 */
export declare function buildAppTask(appDir: string): Promise<void>;
/**
 * Move temporary directory to destination application folder
 *
 * @param tempDir - source path to copy files from
 * @param destination - target path to copy files
 * @param id - item ID
 * @throws if `fs.move` fails
 */
export declare function moveAppTask(tempDir: string, destination: string, id: string): Promise<void>;
