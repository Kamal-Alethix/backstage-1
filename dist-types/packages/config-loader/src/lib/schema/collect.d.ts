import { ConfigSchemaPackageEntry } from './types';
/**
 * This collects all known config schemas across all dependencies of the app.
 */
export declare function collectConfigSchemas(packageNames: string[], packagePaths: string[]): Promise<ConfigSchemaPackageEntry[]>;
