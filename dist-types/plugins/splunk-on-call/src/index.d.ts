/**
 * A Backstage plugin that integrates towards Splunk On-Call
 *
 * @packageDocumentation
 */
export { EntitySplunkOnCallCard, splunkOnCallPlugin, splunkOnCallPlugin as plugin, SplunkOnCallPage, } from './plugin';
export { isSplunkOnCallAvailable } from './components/EntitySplunkOnCallCard';
export { SplunkOnCallClient, splunkOnCallApiRef, UnauthorizedError, } from './api/client';
