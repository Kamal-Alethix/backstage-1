import { UrlReader } from '@backstage/backend-common';
import { ScmIntegrations } from '@backstage/integration';
/**
 * Downloads content and places it in the workspace, or optionally
 * in a subdirectory specified by the 'targetPath' input option.
 * @public
 */
export declare function createFetchPlainAction(options: {
    reader: UrlReader;
    integrations: ScmIntegrations;
}): import("../..").TemplateAction<{
    url: string;
    targetPath?: string | undefined;
}>;
