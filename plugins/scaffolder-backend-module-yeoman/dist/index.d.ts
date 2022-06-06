import * as _backstage_plugin_scaffolder_backend from '@backstage/plugin-scaffolder-backend';
import { JsonObject } from '@backstage/types';

/**
 * Creates a `run:yeoman` Scaffolder action.
 *
 * @remarks
 *
 * See {@link https://yeoman.io/} and {@link https://backstage.io/docs/features/software-templates/writing-custom-actions}.
 *
 * @public
 */
declare function createRunYeomanAction(): _backstage_plugin_scaffolder_backend.TemplateAction<{
    namespace: string;
    args?: string[] | undefined;
    options?: JsonObject | undefined;
}>;

export { createRunYeomanAction };
