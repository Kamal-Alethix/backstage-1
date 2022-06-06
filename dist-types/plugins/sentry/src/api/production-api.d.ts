import { SentryIssue } from './sentry-issue';
import { SentryApi } from './sentry-api';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
export declare class ProductionSentryApi implements SentryApi {
    private readonly discoveryApi;
    private readonly organization;
    private readonly identityApi?;
    constructor(discoveryApi: DiscoveryApi, organization: string, identityApi?: IdentityApi | undefined);
    fetchIssues(project: string, statsFor: string, query?: string): Promise<SentryIssue[]>;
    private authOptions;
}
