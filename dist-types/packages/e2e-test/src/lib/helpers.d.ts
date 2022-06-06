/// <reference types="node" />
import { SpawnOptions, ChildProcess } from 'child_process';
import puppeteer from 'puppeteer';
export declare function spawnPiped(cmd: string[], options?: SpawnOptions): ChildProcess;
export declare function runPlain(cmd: string[], options?: SpawnOptions): Promise<string>;
export declare function exitWithError(err: Error & {
    code?: unknown;
}): void;
/**
 * Waits for fn() to be true
 * Checks every 100ms
 * .cancel() is available
 * @returns Promise of resolution
 */
export declare function waitFor(fn: () => boolean, maxSeconds?: number): Promise<void>;
export declare function waitForExit(child: ChildProcess): Promise<void>;
export declare function waitForPageWithText(page: puppeteer.Page, path: string, text: string, { intervalMs, maxFindAttempts }?: {
    intervalMs?: number | undefined;
    maxFindAttempts?: number | undefined;
}): Promise<void>;
export declare function print(msg: string): boolean;
