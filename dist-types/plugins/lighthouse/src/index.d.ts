/**
 * A Backstage plugin that integrates towards Lighthouse
 *
 * @packageDocumentation
 */
export { lighthousePlugin, lighthousePlugin as plugin, LighthousePage, EntityLighthouseContent, EntityLastLighthouseAuditCard, } from './plugin';
export { Router, isLighthouseAvailable as isPluginApplicableToEntity, isLighthouseAvailable, EmbeddedRouter, } from './Router';
export * from './api';
export * from './components/Cards';
