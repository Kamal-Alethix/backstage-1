import { ContainerRunner, UrlReader } from '@backstage/backend-common';
import { JsonObject } from '@backstage/types';
import { ScmIntegrations } from '@backstage/integration';
/**
 * Creates the `fetch:rails` Scaffolder action.
 *
 * @remarks
 *
 * See {@link https://guides.rubyonrails.org/rails_application_templates.html} and {@link https://backstage.io/docs/features/software-templates/writing-custom-actions}.
 *
 * @param options - Configuration of the templater.
 * @public
 */
export declare function createFetchRailsAction(options: {
    reader: UrlReader;
    integrations: ScmIntegrations;
    containerRunner: ContainerRunner;
    /** A list of image names that are allowed to be passed as imageName input */
    allowedImageNames?: string[];
}): import("@backstage/plugin-scaffolder-backend").TemplateAction<{
    url: string;
    targetPath?: string | undefined;
    values: JsonObject;
    imageName?: string | undefined;
}>;
