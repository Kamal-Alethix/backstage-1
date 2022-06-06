import { gitReleaseManagerApiRef } from './api/serviceApiRef';
import * as constants from './constants/constants';
import * as helpers from './helpers';
import * as components from './components';
import * as testHelpers from './test-helpers';
export { gitReleaseManagerApiRef, constants, helpers, components, testHelpers };
export declare const gitReleaseManagerPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    root: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {}>;
export declare const GitReleaseManagerPage: typeof import("./GitReleaseManager").GitReleaseManager;
