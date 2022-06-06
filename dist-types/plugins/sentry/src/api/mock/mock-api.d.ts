import { SentryIssue } from '../sentry-issue';
import { SentryApi } from '../sentry-api';
export declare class MockSentryApi implements SentryApi {
    fetchIssues(): Promise<SentryIssue[]>;
}
