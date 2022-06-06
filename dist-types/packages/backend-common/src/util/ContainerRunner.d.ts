/// <reference types="node" />
import { Writable } from 'stream';
/**
 * Options passed to the {@link ContainerRunner.runContainer} method.
 *
 * @public
 */
export declare type RunContainerOptions = {
    imageName: string;
    command?: string | string[];
    args: string[];
    logStream?: Writable;
    mountDirs?: Record<string, string>;
    workingDir?: string;
    envVars?: Record<string, string>;
    pullImage?: boolean;
};
/**
 * Handles the running of containers, on behalf of others.
 *
 * @public
 */
export interface ContainerRunner {
    /**
     * Runs a container image to completion.
     */
    runContainer(opts: RunContainerOptions): Promise<void>;
}
