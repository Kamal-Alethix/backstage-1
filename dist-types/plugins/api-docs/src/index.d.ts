/**
 * A Backstage plugin that helps represent API entities in the frontend
 *
 * @packageDocumentation
 */
export * from './components';
export { apiDocsConfigRef } from './config';
export { apiDocsPlugin, apiDocsPlugin as plugin, ApiExplorerPage, EntityApiDefinitionCard, EntityConsumedApisCard, EntityConsumingComponentsCard, EntityHasApisCard, EntityProvidedApisCard, EntityProvidingComponentsCard, } from './plugin';
