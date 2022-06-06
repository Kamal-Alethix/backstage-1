/**
 * A Backstage plugin that integrates towards PagerDuty
 *
 * @packageDocumentation
 */
export { pagerDutyPlugin, pagerDutyPlugin as plugin, EntityPagerDutyCard, } from './plugin';
export { isPluginApplicableToEntity, isPluginApplicableToEntity as isPagerDutyAvailable, PagerDutyCard, } from './components/PagerDutyCard';
export { TriggerButton } from './components/TriggerButton';
export { PagerDutyClient, pagerDutyApiRef, UnauthorizedError, } from './api/client';
