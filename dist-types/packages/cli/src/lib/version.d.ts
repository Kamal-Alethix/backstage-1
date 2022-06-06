import { Lockfile } from './versioning';
export declare const packageVersions: Record<string, string>;
export declare function findVersion(): any;
export declare const version: any;
export declare const isDev: boolean;
export declare function createPackageVersionProvider(lockfile?: Lockfile): (name: string, versionHint?: string | undefined) => string;
