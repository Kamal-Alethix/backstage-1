import * as winston from 'winston';
/**
 * Gets the current root logger.
 *
 * @public
 */
export declare function getRootLogger(): winston.Logger;
/**
 * Sets a completely custom default "root" logger.
 *
 * @remarks
 *
 * This is the logger instance that will be the foundation for all other logger
 * instances passed to plugins etc, in a given backend.
 *
 * Only use this if you absolutely need to make a completely custom logger.
 * Normally if you want to make light adaptations to the default logger
 * behavior, you would instead call {@link createRootLogger}.
 *
 * @public
 */
export declare function setRootLogger(newLogger: winston.Logger): void;
export declare function setRootLoggerRedactionList(redactionList: string[]): void;
/**
 * Creates a default "root" logger. This also calls {@link setRootLogger} under
 * the hood.
 *
 * @remarks
 *
 * This is the logger instance that will be the foundation for all other logger
 * instances passed to plugins etc, in a given backend.
 *
 * @public
 */
export declare function createRootLogger(options?: winston.LoggerOptions, env?: NodeJS.ProcessEnv): winston.Logger;
