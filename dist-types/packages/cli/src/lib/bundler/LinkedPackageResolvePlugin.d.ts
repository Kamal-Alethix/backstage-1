import { WebpackPluginInstance } from 'webpack';
import { Package } from '@manypkg/get-packages';
export declare class LinkedPackageResolvePlugin implements WebpackPluginInstance {
    private readonly targetModules;
    private readonly packages;
    constructor(targetModules: string, packages: Package[]);
    apply(resolver: any): void;
}
