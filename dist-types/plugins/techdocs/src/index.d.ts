/**
 * The Backstage plugin that renders technical documentation for your components
 *
 * @packageDocumentation
 */
import { TechDocsEntityMetadata, TechDocsMetadata } from '@backstage/plugin-techdocs-react';
export * from './types';
export * from './api';
export * from './client';
export * from './reader';
export * from './search';
export * from './home';
export { EntityTechdocsContent, TechDocsCustomHome, TechDocsIndexPage, TechdocsPage, TechDocsReaderPage, techdocsPlugin as plugin, techdocsPlugin, } from './plugin';
export * from './Router';
/**
 * @deprecated Import from `@backstage/plugin-techdocs-react` instead
 *
 * @public
 */
declare type DeprecatedTechDocsMetadata = TechDocsMetadata;
/**
 * @deprecated Import from `@backstage/plugin-techdocs-react` instead
 *
 * @public
 */
declare type DeprecatedTechDocsEntityMetadata = TechDocsEntityMetadata;
export type { DeprecatedTechDocsEntityMetadata as TechDocsEntityMetadata, DeprecatedTechDocsMetadata as TechDocsMetadata, };
