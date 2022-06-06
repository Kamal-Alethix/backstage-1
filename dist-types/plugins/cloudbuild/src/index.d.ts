/**
 * A Backstage plugin that integrates towards Google Cloud Build
 *
 * @packageDocumentation
 */
export { cloudbuildPlugin, cloudbuildPlugin as plugin, EntityCloudbuildContent, EntityLatestCloudbuildRunCard, EntityLatestCloudbuildsForBranchCard, } from './plugin';
export * from './api';
export { Router, isCloudbuildAvailable, isCloudbuildAvailable as isPluginApplicableToEntity, } from './components/Router';
export * from './components/Cards';
export { CLOUDBUILD_ANNOTATION } from './components/useProjectName';
