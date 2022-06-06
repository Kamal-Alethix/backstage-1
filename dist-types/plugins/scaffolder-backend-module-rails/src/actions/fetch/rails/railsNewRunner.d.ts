/// <reference types="node" />
import { ContainerRunner } from '@backstage/backend-common';
import { JsonObject } from '@backstage/types';
import { Writable } from 'stream';
export declare class RailsNewRunner {
    private readonly containerRunner;
    constructor({ containerRunner }: {
        containerRunner: ContainerRunner;
    });
    run({ workspacePath, values, logStream, }: {
        workspacePath: string;
        values: JsonObject;
        logStream: Writable;
    }): Promise<void>;
}
