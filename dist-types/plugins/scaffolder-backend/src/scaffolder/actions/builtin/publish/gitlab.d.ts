import { ScmIntegrationRegistry } from '@backstage/integration';
import { Config } from '@backstage/config';
/**
 * Creates a new action that initializes a git repository of the content in the workspace
 * and publishes it to GitLab.
 *
 * @public
 */
export declare function createPublishGitlabAction(options: {
    integrations: ScmIntegrationRegistry;
    config: Config;
}): import("../..").TemplateAction<{
    repoUrl: string;
    defaultBranch?: string | undefined;
    repoVisibility?: "private" | "public" | "internal" | undefined;
    sourcePath?: string | undefined;
    token?: string | undefined;
    gitCommitMessage?: string | undefined;
    gitAuthorName?: string | undefined;
    gitAuthorEmail?: string | undefined;
}>;
