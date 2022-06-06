import { IconComponent } from '@backstage/core-plugin-api';
export { graphiqlPlugin, graphiqlPlugin as plugin, GraphiQLPage, } from './plugin';
export { GraphiQLPage as Router } from './components';
export * from './lib/api';
export * from './route-refs';
/** @public */
export declare const GraphiQLIcon: IconComponent;
