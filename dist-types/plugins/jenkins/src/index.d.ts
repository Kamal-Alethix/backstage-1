/**
 * A Backstage plugin that integrates towards Jenkins
 *
 * @packageDocumentation
 */
export { jenkinsPlugin, jenkinsPlugin as plugin, EntityJenkinsContent, EntityLatestJenkinsRunCard, } from './plugin';
export { LatestRunCard } from './components/Cards';
export { Router, isJenkinsAvailable, isJenkinsAvailable as isPluginApplicableToEntity, } from './components/Router';
export { JENKINS_ANNOTATION, LEGACY_JENKINS_ANNOTATION } from './constants';
export * from './api';
