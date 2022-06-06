import { Knex } from 'knex';
import { Duration } from 'luxon';
import { AbortSignal } from 'node-abort-controller';
import { Logger } from 'winston';
/**
 * Makes sure to auto-expire and clean up things that time out or for other
 * reasons should not be left lingering.
 */
export declare class PluginTaskSchedulerJanitor {
    private readonly knex;
    private readonly waitBetweenRuns;
    private readonly logger;
    constructor(options: {
        knex: Knex;
        waitBetweenRuns: Duration;
        logger: Logger;
    });
    start(abortSignal?: AbortSignal): Promise<void>;
    private runOnce;
}
