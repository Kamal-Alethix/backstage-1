import { GithubCredentialsProvider, ScmIntegrationRegistry } from '@backstage/integration';
import { Config } from '@backstage/config';
/**
 * Creates a new action that initializes a git repository of the content in the workspace
 * and publishes it to GitHub.
 *
 * @public
 */
export declare function createPublishGithubAction(options: {
    integrations: ScmIntegrationRegistry;
    config: Config;
    githubCredentialsProvider?: GithubCredentialsProvider;
}): import("../..").TemplateAction<{
    repoUrl: string;
    description?: string | undefined;
    access?: string | undefined;
    defaultBranch?: string | undefined;
    protectDefaultBranch?: boolean | undefined;
    deleteBranchOnMerge?: boolean | undefined;
    gitCommitMessage?: string | undefined;
    gitAuthorName?: string | undefined;
    gitAuthorEmail?: string | undefined;
    allowRebaseMerge?: boolean | undefined;
    allowSquashMerge?: boolean | undefined;
    allowMergeCommit?: boolean | undefined;
    sourcePath?: string | undefined;
    requireCodeOwnerReviews?: boolean | undefined;
    requiredStatusCheckContexts?: string[] | undefined;
    repoVisibility?: "private" | "public" | "internal" | undefined;
    collaborators?: ({
        user: string;
        access: 'pull' | 'push' | 'admin' | 'maintain' | 'triage';
    } | {
        team: string;
        access: 'pull' | 'push' | 'admin' | 'maintain' | 'triage';
    } | {
        /** @deprecated This field is deprecated in favor of team */
        username: string;
        access: 'pull' | 'push' | 'admin' | 'maintain' | 'triage';
    })[] | undefined;
    token?: string | undefined;
    topics?: string[] | undefined;
}>;
