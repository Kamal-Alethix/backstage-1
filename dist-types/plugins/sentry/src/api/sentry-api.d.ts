import { SentryIssue } from './sentry-issue';
export declare const sentryApiRef: import("@backstage/core-plugin-api").ApiRef<SentryApi>;
export interface SentryApi {
    fetchIssues(project: string, statsFor: string, query?: string): Promise<SentryIssue[]>;
}
