/// <reference types="node" />
import { Logger } from 'winston';
import { Writable } from 'stream';
import { JsonValue, JsonObject } from '@backstage/types';
import { Schema } from 'jsonschema';
import { TaskSecrets } from '../tasks/types';
import { TemplateInfo } from '@backstage/plugin-scaffolder-common';
/**
 * ActionContext is passed into scaffolder actions.
 * @public
 */
export declare type ActionContext<Input extends JsonObject> = {
    logger: Logger;
    logStream: Writable;
    secrets?: TaskSecrets;
    workspacePath: string;
    input: Input;
    output(name: string, value: JsonValue): void;
    /**
     * Creates a temporary directory for use by the action, which is then cleaned up automatically.
     */
    createTemporaryDirectory(): Promise<string>;
    templateInfo?: TemplateInfo;
    /**
     * Whether this action invocation is a dry-run or not.
     * This will only ever be true if the actions as marked as supporting dry-runs.
     */
    isDryRun?: boolean;
};
/** @public */
export declare type TemplateAction<Input extends JsonObject> = {
    id: string;
    description?: string;
    supportsDryRun?: boolean;
    schema?: {
        input?: Schema;
        output?: Schema;
    };
    handler: (ctx: ActionContext<Input>) => Promise<void>;
};
