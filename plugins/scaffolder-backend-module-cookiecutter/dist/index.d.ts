/// <reference types="node" />
import * as _backstage_plugin_scaffolder_backend from '@backstage/plugin-scaffolder-backend';
import { UrlReader, ContainerRunner } from '@backstage/backend-common';
import { JsonObject } from '@backstage/types';
import { ScmIntegrations } from '@backstage/integration';

/**
 * Creates a `fetch:cookiecutter` Scaffolder action.
 *
 * @remarks
 *
 * See {@link https://cookiecutter.readthedocs.io/} and {@link https://backstage.io/docs/features/software-templates/writing-custom-actions}.
 * @param options - Templating configuration.
 * @public
 */
declare function createFetchCookiecutterAction(options: {
    reader: UrlReader;
    integrations: ScmIntegrations;
    containerRunner: ContainerRunner;
}): _backstage_plugin_scaffolder_backend.TemplateAction<{
    url: string;
    targetPath?: string | undefined;
    values: JsonObject;
    copyWithoutRender?: string[] | undefined;
    extensions?: string[] | undefined;
    imageName?: string | undefined;
}>;

export { createFetchCookiecutterAction };
