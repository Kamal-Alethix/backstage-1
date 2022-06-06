import { OptionValues } from 'commander';
export declare const capitalize: (str: string) => string;
export declare const addExportStatement: (file: string, exportStatement: string) => Promise<void>;
export declare function addPluginDependencyToApp(rootDir: string, pluginPackage: string, versionStr: string): Promise<void>;
export declare function addPluginExtensionToApp(pluginId: string, extensionName: string, pluginPackage: string): Promise<void>;
export declare function movePlugin(tempDir: string, destination: string, id: string): Promise<void>;
declare const _default: (opts: OptionValues) => Promise<void>;
export default _default;
