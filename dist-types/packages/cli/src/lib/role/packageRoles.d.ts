import { OptionValues } from 'commander';
import { PackageRole, PackageRoleInfo } from './types';
export declare function getRoleInfo(role: string): PackageRoleInfo;
export declare function getRoleFromPackage(pkgJson: unknown): PackageRole | undefined;
export declare function findRoleFromCommand(opts: OptionValues): Promise<PackageRole>;
export declare function detectRoleFromPackage(pkgJson: unknown): PackageRole | undefined;
