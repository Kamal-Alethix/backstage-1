import { OptionValues } from 'commander';
export declare type PluginData = {
    id: string;
    name: string;
    privatePackage: string;
    pluginVersion: string;
    npmRegistry: string;
};
declare const _default: (opts: OptionValues) => Promise<void>;
export default _default;
