/**
 * A Backstage plugin that integrates towards Circle CI
 *
 * @packageDocumentation
 */
export { circleCIPlugin, circleCIPlugin as plugin, EntityCircleCIContent, } from './plugin';
export * from './api';
export * from './route-refs';
export { Router, isCircleCIAvailable, isCircleCIAvailable as isPluginApplicableToEntity, } from './components/Router';
export { CIRCLECI_ANNOTATION } from './constants';
