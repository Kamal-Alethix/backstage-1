import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { AnalyticsApi, IdentityApi, AnalyticsEvent } from '@backstage/core-plugin-api';
import { Config } from '@backstage/config';

/**
 * @deprecated Importing and including this plugin in an app has no effect.
 * This will be removed in a future release.
 *
 * @public
 */
declare const analyticsModuleGA: _backstage_core_plugin_api.BackstagePlugin<{}, {}>;

/**
 * Google Analytics API provider for the Backstage Analytics API.
 * @public
 */
declare class GoogleAnalytics implements AnalyticsApi {
    private readonly cdmConfig;
    private customUserIdTransform?;
    private readonly capture;
    /**
     * Instantiate the implementation and initialize ReactGA.
     */
    private constructor();
    /**
     * Instantiate a fully configured GA Analytics API implementation.
     */
    static fromConfig(config: Config, options?: {
        identityApi?: IdentityApi;
        userIdTransform?: 'sha-256' | ((userEntityRef: string) => Promise<string>);
    }): GoogleAnalytics;
    /**
     * Primary event capture implementation. Handles core navigate event as a
     * pageview and the rest as custom events. All custom dimensions/metrics are
     * applied as they should be (set on pageview, merged object on events).
     */
    captureEvent(event: AnalyticsEvent): void;
    /**
     * Returns an object of dimensions/metrics given an Analytics Context and an
     * Event Attributes, e.g. { dimension1: "some value", metric8: 42 }
     */
    private getCustomDimensionMetrics;
    /**
     * Sets the GA userId, based on the `userEntityRef` set on the backstage
     * identity loaded from a given Backstage Identity API instance. Because
     * Google forbids sending any PII (including on the userId field), we hash
     * the entire `userEntityRef` on behalf of integrators:
     *
     * - With value `User:default/name`, userId becomes `sha256(User:default/name)`
     *
     * If an integrator wishes to use an alternative hashing mechanism or an
     * entirely different value, they may do so by passing a `userIdTransform`
     * function alongside the `identityApi` to `GoogleAnalytics.fromConfig()`.
     * This function receives the `userEntityRef` as an argument and should
     * resolve to a hashed version of whatever identifier they choose.
     *
     * Note: this feature requires that an integrator has set up a Google
     * Analytics User ID view in the property used to track Backstage.
     */
    private setUserFrom;
    /**
     * Returns a PII-free (according to Google's terms of service) user ID for
     * use in Google Analytics.
     */
    private getPrivateUserId;
    /**
     * Simple hash function; relies on web cryptography + the sha-256 algorithm.
     */
    private hash;
}

export { GoogleAnalytics, analyticsModuleGA };
