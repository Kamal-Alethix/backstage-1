/**
 * A Backstage plugin that integrates towards Rollbar
 *
 * @packageDocumentation
 */
export * from './api';
export { EntityPageRollbar } from './components/EntityPageRollbar/EntityPageRollbar';
export { isPluginApplicableToEntity, isPluginApplicableToEntity as isRollbarAvailable, Router, } from './components/Router';
export { ROLLBAR_ANNOTATION } from './constants';
export { EntityRollbarContent, rollbarPlugin as plugin, rollbarPlugin, } from './plugin';
