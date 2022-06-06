import { UrlReader } from '@backstage/backend-common';
import { ScmIntegrations } from '@backstage/integration';
import { TemplateFilter } from '../../../../lib/templating/SecureTemplater';
/**
 * Downloads a skeleton, templates variables into file and directory names and content.
 * Then places the result in the workspace, or optionally in a subdirectory
 * specified by the 'targetPath' input option.
 *
 * @public
 */
export declare function createFetchTemplateAction(options: {
    reader: UrlReader;
    integrations: ScmIntegrations;
    additionalTemplateFilters?: Record<string, TemplateFilter>;
}): import("../..").TemplateAction<{
    url: string;
    targetPath?: string | undefined;
    values: any;
    templateFileExtension?: string | boolean | undefined;
    copyWithoutRender?: string[] | undefined;
    cookiecutterCompat?: boolean | undefined;
}>;
