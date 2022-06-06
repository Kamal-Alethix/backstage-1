import { ModuleOptions, WebpackPluginInstance } from 'webpack';
declare type Transforms = {
    loaders: ModuleOptions['rules'];
    plugins: WebpackPluginInstance[];
};
declare type TransformOptions = {
    isDev: boolean;
    isBackend?: boolean;
};
export declare const transforms: (options: TransformOptions) => Transforms;
export {};
