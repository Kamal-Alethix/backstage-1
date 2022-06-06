/**
 * A Backstage plugin that integrates towards Sentry
 *
 * @packageDocumentation
 */
export * from './api';
export * from './components';
export { sentryPlugin, sentryPlugin as plugin } from './plugin';
export { EntitySentryCard, EntitySentryContent } from './extensions';
export { Router } from './components/Router';
