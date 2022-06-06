export declare type PackageRole = 'frontend' | 'backend' | 'cli' | 'web-library' | 'node-library' | 'common-library' | 'frontend-plugin' | 'frontend-plugin-module' | 'backend-plugin' | 'backend-plugin-module';
export declare type PackagePlatform = 'node' | 'web' | 'common';
export declare type PackageOutputType = 'bundle' | 'types' | 'esm' | 'cjs';
export interface PackageRoleInfo {
    role: PackageRole;
    platform: PackagePlatform;
    output: PackageOutputType[];
}
