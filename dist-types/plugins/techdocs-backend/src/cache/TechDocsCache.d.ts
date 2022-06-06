/// <reference types="node" />
import { CacheClient } from '@backstage/backend-common';
import { CustomErrorBase } from '@backstage/errors';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
export declare class CacheInvalidationError extends CustomErrorBase {
}
export declare class TechDocsCache {
    protected readonly cache: CacheClient;
    protected readonly logger: Logger;
    protected readonly readTimeout: number;
    private constructor();
    static fromConfig(config: Config, { cache, logger }: {
        cache: CacheClient;
        logger: Logger;
    }): TechDocsCache;
    get(path: string): Promise<Buffer | undefined>;
    set(path: string, data: Buffer): Promise<void>;
    invalidate(path: string): Promise<void>;
    invalidateMultiple(paths: string[]): Promise<PromiseSettledResult<void>[]>;
}
