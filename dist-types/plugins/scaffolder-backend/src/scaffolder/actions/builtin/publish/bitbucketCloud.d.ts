import { ScmIntegrationRegistry } from '@backstage/integration';
import { Config } from '@backstage/config';
/**
 * Creates a new action that initializes a git repository of the content in the workspace
 * and publishes it to Bitbucket Cloud.
 * @public
 */
export declare function createPublishBitbucketCloudAction(options: {
    integrations: ScmIntegrationRegistry;
    config: Config;
}): import("../..").TemplateAction<{
    repoUrl: string;
    description?: string | undefined;
    defaultBranch?: string | undefined;
    repoVisibility?: "private" | "public" | undefined;
    sourcePath?: string | undefined;
    token?: string | undefined;
}>;
