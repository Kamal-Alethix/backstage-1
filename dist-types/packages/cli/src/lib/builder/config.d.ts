import { RollupOptions } from 'rollup';
import { BuildOptions } from './types';
export declare function makeRollupConfigs(options: BuildOptions): Promise<RollupOptions[]>;
