/**
 * The Backstage backend plugin that renders technical documentation for your components
 *
 * @packageDocumentation
 */
export { createRouter } from './service';
export type { RouterOptions, RecommendedDeploymentOptions, OutOfTheBoxDeploymentOptions, DocsBuildStrategy, ShouldBuildParameters, } from './service';
export { DefaultTechDocsCollator, DefaultTechDocsCollatorFactory, } from './search';
export type { TechDocsCollatorFactoryOptions, TechDocsCollatorOptions, } from './search';
/**
 * @deprecated Use directly from @backstage/plugin-techdocs-node
 */
export type { TechDocsDocument } from '@backstage/plugin-techdocs-node';
export * from '@backstage/plugin-techdocs-node';
