import { IconComponent } from '@backstage/core-plugin-api';
export { ilertPlugin, ilertPlugin as plugin, ILertPage, EntityILertCard, } from './plugin';
export { ILertPage as Router, isPluginApplicableToEntity, isPluginApplicableToEntity as isILertAvailable, ILertCard, } from './components';
export * from './api';
export * from './route-refs';
export declare const ILertIcon: IconComponent;
