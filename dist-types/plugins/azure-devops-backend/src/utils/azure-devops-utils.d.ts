import { DashboardPullRequest, Policy } from '@backstage/plugin-azure-devops-common';
import { GitPullRequest } from 'azure-devops-node-api/interfaces/GitInterfaces';
import { IdentityRef } from 'azure-devops-node-api/interfaces/common/VSSInterfaces';
import { PolicyEvaluationRecord } from 'azure-devops-node-api/interfaces/PolicyInterfaces';
export declare function convertDashboardPullRequest(pullRequest: GitPullRequest, baseUrl: string, policies: Policy[] | undefined): DashboardPullRequest;
export declare function getPullRequestLink(baseUrl: string, pullRequest: GitPullRequest): string | undefined;
/**
 * Tries to get the avatar from the new property if not then falls-back to deprecated `imageUrl`.
 * https://docs.microsoft.com/en-us/rest/api/azure/devops/git/pull-requests/get-pull-requests-by-project?view=azure-devops-rest-6.0#identityref
 */
export declare function getAvatarUrl(identity: IdentityRef): string | undefined;
export declare function getArtifactId(projectId: string, pullRequestId: number): string;
export declare function convertPolicy(policyEvaluationRecord: PolicyEvaluationRecord): Policy | undefined;
