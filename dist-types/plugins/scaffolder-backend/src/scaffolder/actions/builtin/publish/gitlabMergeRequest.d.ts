import { ScmIntegrationRegistry } from '@backstage/integration';
/**
 * Create a new action that creates a gitlab merge request.
 *
 * @public
 */
export declare const createPublishGitlabMergeRequestAction: (options: {
    integrations: ScmIntegrationRegistry;
}) => import("../..").TemplateAction<{
    projectid: string;
    repoUrl: string;
    title: string;
    description: string;
    branchName: string;
    targetPath: string;
    token?: string | undefined;
}>;
