import { AnalyticsApi, AnalyticsEventAttributes, AnalyticsTracker } from '../apis';
import { AnalyticsContextValue } from './';
export declare class Tracker implements AnalyticsTracker {
    private readonly analyticsApi;
    private context;
    constructor(analyticsApi: AnalyticsApi, context?: AnalyticsContextValue);
    setContext(context: AnalyticsContextValue): void;
    captureEvent(action: string, subject: string, { value, attributes, }?: {
        value?: number;
        attributes?: AnalyticsEventAttributes;
    }): void;
}
