/**
 * A Backstage plugin that lets you display a Tech Radar for your organization
 *
 * @packageDocumentation
 */
import { RadarPage } from './components';
export { techRadarPlugin, techRadarPlugin as plugin, TechRadarPage, } from './plugin';
export * from './components';
/**
 * @deprecated Use plugin extensions instead
 */
export declare const Router: typeof RadarPage;
/**
 * The TypeScript API for configuring Tech Radar.
 */
export * from './api';
