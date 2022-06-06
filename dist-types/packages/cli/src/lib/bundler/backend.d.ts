import { BackendServeOptions } from './types';
export declare function serveBackend(options: BackendServeOptions): Promise<() => Promise<unknown>>;
