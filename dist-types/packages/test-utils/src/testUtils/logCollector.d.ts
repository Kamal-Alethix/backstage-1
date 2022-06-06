/**
 * Severity levels of {@link CollectedLogs}
 * @public
 */
export declare type LogFuncs = 'log' | 'warn' | 'error';
/**
 * AsyncLogCollector type used in {@link (withLogCollector:1)} callback function.
 * @public
 */
export declare type AsyncLogCollector = () => Promise<void>;
/**
 * SyncLogCollector type used in {@link (withLogCollector:2)} callback function.
 * @public
 */
export declare type SyncLogCollector = () => void;
/**
 * Union type used in {@link (withLogCollector:3)} callback function.
 * @public
 */
export declare type LogCollector = AsyncLogCollector | SyncLogCollector;
/**
 * Map of severity level and corresponding log lines.
 * @public
 */
export declare type CollectedLogs<T extends LogFuncs> = {
    [key in T]: string[];
};
/**
 * Asynchronous log collector with that collects all categories
 * @public
 */
export declare function withLogCollector(callback: AsyncLogCollector): Promise<CollectedLogs<LogFuncs>>;
/**
 * Synchronous log collector with that collects all categories
 * @public
 */
export declare function withLogCollector(callback: SyncLogCollector): CollectedLogs<LogFuncs>;
/**
 * Asynchronous log collector with that only collects selected categories
 * @public
 */
export declare function withLogCollector<T extends LogFuncs>(logsToCollect: T[], callback: AsyncLogCollector): Promise<CollectedLogs<T>>;
/**
 * Synchronous log collector with that only collects selected categories
 * @public
 */
export declare function withLogCollector<T extends LogFuncs>(logsToCollect: T[], callback: SyncLogCollector): CollectedLogs<T>;
