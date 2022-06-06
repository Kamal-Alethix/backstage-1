/**
 * A Backstage plugin that integrates towards GitHub Actions
 *
 * @packageDocumentation
 */
export { githubActionsPlugin, githubActionsPlugin as plugin, EntityGithubActionsContent, EntityLatestGithubActionRunCard, EntityLatestGithubActionsForBranchCard, EntityRecentGithubActionsRunsCard, } from './plugin';
export * from './api';
export { Router, isGithubActionsAvailable, isGithubActionsAvailable as isPluginApplicableToEntity, } from './components/Router';
export * from './components/Cards';
export { GITHUB_ACTIONS_ANNOTATION } from './components/getProjectNameFromEntity';
