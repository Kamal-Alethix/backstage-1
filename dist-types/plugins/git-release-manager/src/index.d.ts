/**
 * A Backstage plugin that helps you manage releases in git
 *
 * @packageDocumentation
 */
export { gitReleaseManagerPlugin, GitReleaseManagerPage, gitReleaseManagerApiRef, } from './plugin';
import { components, constants, helpers, testHelpers } from './plugin';
export declare const internals: {
    components: typeof components;
    constants: typeof constants;
    helpers: typeof helpers;
    testHelpers: typeof testHelpers;
};
