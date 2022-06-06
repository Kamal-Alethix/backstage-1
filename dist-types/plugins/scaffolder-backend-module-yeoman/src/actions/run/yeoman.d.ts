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
export declare function createRunYeomanAction(): import("@backstage/plugin-scaffolder-backend").TemplateAction<{
    namespace: string;
    args?: string[] | undefined;
    options?: JsonObject | undefined;
}>;
