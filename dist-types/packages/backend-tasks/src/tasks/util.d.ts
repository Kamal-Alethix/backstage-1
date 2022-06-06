import { Knex } from 'knex';
import { DateTime, Duration } from 'luxon';
import { AbortController, AbortSignal } from 'node-abort-controller';
export declare function validateId(id: string): void;
export declare function dbTime(t: Date | string): DateTime;
export declare function nowPlus(duration: Duration | undefined, knex: Knex): Knex.Raw<any>;
/**
 * Sleep for the given duration, but return sooner if the abort signal
 * triggers.
 *
 * @param duration - The amount of time to sleep, at most
 * @param abortSignal - An optional abort signal that short circuits the wait
 */
export declare function sleep(duration: Duration, abortSignal?: AbortSignal): Promise<void>;
/**
 * Creates a new AbortController that, in addition to working as a regular
 * standalone controller, also gets aborted if the given parent signal
 * reaches aborted state.
 *
 * @param parent - The "parent" signal that can trigger the delegate
 */
export declare function delegateAbortController(parent?: AbortSignal): AbortController;
