import { AnalyticsApi, AnalyticsEvent } from '@backstage/core-plugin-api';
/**
 * Mock implementation of {@link core-plugin-api#AnalyticsApi} with helpers to ensure that events are sent correctly.
 * Use getEvents in tests to verify captured events.
 *
 * @public
 */
export declare class MockAnalyticsApi implements AnalyticsApi {
    private events;
    captureEvent(event: AnalyticsEvent): void;
    getEvents(): AnalyticsEvent[];
}
