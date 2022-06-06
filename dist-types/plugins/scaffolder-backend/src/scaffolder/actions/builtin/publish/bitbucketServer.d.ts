import { ScmIntegrationRegistry } from '@backstage/integration';
import { Config } from '@backstage/config';
/**
 * Creates a new action that initializes a git repository of the content in the workspace
 * and publishes it to Bitbucket Server.
 * @public
 */
export declare function createPublishBitbucketServerAction(options: {
    integrations: ScmIntegrationRegistry;
    config: Config;
}): import("../..").TemplateAction<{
    repoUrl: string;
    description?: string | undefined;
    defaultBranch?: string | undefined;
    repoVisibility?: "private" | "public" | undefined;
    sourcePath?: string | undefined;
    enableLFS?: boolean | undefined;
    token?: string | undefined;
}>;
