import { AnalyticsApi, AnalyticsEvent } from '@backstage/core-plugin-api';
/**
 * Base implementation for the AnalyticsApi that does nothing.
 *
 * @public
 */
export declare class NoOpAnalyticsApi implements AnalyticsApi {
    captureEvent(_event: AnalyticsEvent): void;
}
