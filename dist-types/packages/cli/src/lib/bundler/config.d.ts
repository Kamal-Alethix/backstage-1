import webpack from 'webpack';
import { Config } from '@backstage/config';
import { BundlingPaths } from './paths';
import { BundlingOptions, BackendBundlingOptions } from './types';
export declare function resolveBaseUrl(config: Config): URL;
export declare function createConfig(paths: BundlingPaths, options: BundlingOptions): Promise<webpack.Configuration>;
export declare function createBackendConfig(paths: BundlingPaths, options: BackendBundlingOptions): Promise<webpack.Configuration>;
