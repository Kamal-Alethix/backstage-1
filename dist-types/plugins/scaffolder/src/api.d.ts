import { DiscoveryApi, FetchApi, IdentityApi } from '@backstage/core-plugin-api';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { Observable } from '@backstage/types';
import { ListActionsResponse, LogEvent, ScaffolderApi, TemplateParameterSchema, ScaffolderScaffoldOptions, ScaffolderScaffoldResponse, ScaffolderStreamLogsOptions, ScaffolderGetIntegrationsListOptions, ScaffolderGetIntegrationsListResponse, ScaffolderTask, ScaffolderDryRunOptions, ScaffolderDryRunResponse } from './types';
/**
 * Utility API reference for the {@link ScaffolderApi}.
 *
 * @public
 */
export declare const scaffolderApiRef: import("@backstage/core-plugin-api").ApiRef<ScaffolderApi>;
/**
 * An API to interact with the scaffolder backend.
 *
 * @public
 */
export declare class ScaffolderClient implements ScaffolderApi {
    private readonly discoveryApi;
    private readonly scmIntegrationsApi;
    private readonly fetchApi;
    private readonly identityApi?;
    private readonly useLongPollingLogs;
    constructor(options: {
        discoveryApi: DiscoveryApi;
        fetchApi: FetchApi;
        identityApi?: IdentityApi;
        scmIntegrationsApi: ScmIntegrationRegistry;
        useLongPollingLogs?: boolean;
    });
    listTasks(options: {
        filterByOwnership: 'owned' | 'all';
    }): Promise<{
        tasks: ScaffolderTask[];
    }>;
    getIntegrationsList(options: ScaffolderGetIntegrationsListOptions): Promise<ScaffolderGetIntegrationsListResponse>;
    getTemplateParameterSchema(templateRef: string): Promise<TemplateParameterSchema>;
    /**
     * Executes the scaffolding of a component, given a template and its
     * parameter values.
     *
     * @param options - The {@link ScaffolderScaffoldOptions} the scaffolding.
     */
    scaffold(options: ScaffolderScaffoldOptions): Promise<ScaffolderScaffoldResponse>;
    getTask(taskId: string): Promise<ScaffolderTask>;
    streamLogs(options: ScaffolderStreamLogsOptions): Observable<LogEvent>;
    dryRun(options: ScaffolderDryRunOptions): Promise<ScaffolderDryRunResponse>;
    private streamLogsEventStream;
    private streamLogsPolling;
    listActions(): Promise<ListActionsResponse>;
}
