import { Config } from '@backstage/config';
import { ScmIntegrationRegistry } from '@backstage/integration';
/**
 * Creates a new action that initializes a git repository of the content in the workspace
 * and publishes it to a Gerrit instance.
 * @public
 */
export declare function createPublishGerritAction(options: {
    integrations: ScmIntegrationRegistry;
    config: Config;
}): import("../..").TemplateAction<{
    repoUrl: string;
    description: string;
    defaultBranch?: string | undefined;
    gitCommitMessage?: string | undefined;
    gitAuthorName?: string | undefined;
    gitAuthorEmail?: string | undefined;
}>;
