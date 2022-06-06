/**
 * ADR frontend plugin
 *
 * @packageDocumentation
 */
export { isAdrAvailable } from '@backstage/plugin-adr-common';
export * from './components/AdrReader';
export { adrPlugin, EntityAdrContent } from './plugin';
export * from './search';
