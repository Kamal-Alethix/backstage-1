/// <reference types="node" />
import { ContainerRunner, UrlReader } from '@backstage/backend-common';
import { JsonObject } from '@backstage/types';
import { ScmIntegrations } from '@backstage/integration';
import { Writable } from 'stream';
export declare class CookiecutterRunner {
    private readonly containerRunner;
    constructor({ containerRunner }: {
        containerRunner: ContainerRunner;
    });
    private fetchTemplateCookieCutter;
    run({ workspacePath, values, logStream, imageName, templateDir, templateContentsDir, }: {
        workspacePath: string;
        values: JsonObject;
        logStream: Writable;
        imageName?: string;
        templateDir: string;
        templateContentsDir: string;
    }): Promise<void>;
}
/**
 * Creates a `fetch:cookiecutter` Scaffolder action.
 *
 * @remarks
 *
 * See {@link https://cookiecutter.readthedocs.io/} and {@link https://backstage.io/docs/features/software-templates/writing-custom-actions}.
 * @param options - Templating configuration.
 * @public
 */
export declare function createFetchCookiecutterAction(options: {
    reader: UrlReader;
    integrations: ScmIntegrations;
    containerRunner: ContainerRunner;
}): import("@backstage/plugin-scaffolder-backend").TemplateAction<{
    url: string;
    targetPath?: string | undefined;
    values: JsonObject;
    copyWithoutRender?: string[] | undefined;
    extensions?: string[] | undefined;
    imageName?: string | undefined;
}>;
