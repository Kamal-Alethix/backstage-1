import { BuildOptions, Output } from './types';
export declare function formatErrorMessage(error: any): string;
export declare const buildPackage: (options: BuildOptions) => Promise<void>;
export declare const buildPackages: (options: BuildOptions[]) => Promise<void>;
export declare function getOutputsForRole(role: string): Set<Output>;
