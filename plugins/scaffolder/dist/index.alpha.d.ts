/**
 * The Backstage plugin that helps you create new things
 *
 * @packageDocumentation
 */

/// <reference types="react" />

import { ApiHolder } from '@backstage/core-plugin-api';
import { ApiRef } from '@backstage/core-plugin-api';
import { BackstagePlugin } from '@backstage/core-plugin-api';
import { ComponentType } from 'react';
import { DiscoveryApi } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { Extension } from '@backstage/core-plugin-api';
import { ExternalRouteRef } from '@backstage/core-plugin-api';
import { FetchApi } from '@backstage/core-plugin-api';
import { FieldProps } from '@rjsf/core';
import { FieldValidation } from '@rjsf/core';
import { IdentityApi } from '@backstage/core-plugin-api';
import { JsonObject } from '@backstage/types';
import { JSONSchema7 } from 'json-schema';
import { JsonValue } from '@backstage/types';
import { Observable } from '@backstage/types';
import { PropsWithChildren } from 'react';
import { default as React_2 } from 'react';
import { RouteRef } from '@backstage/core-plugin-api';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { TaskSpec } from '@backstage/plugin-scaffolder-common';
import { TaskStep } from '@backstage/plugin-scaffolder-common';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';

/**
 * Method for creating field extensions that can be used in the scaffolder
 * frontend form.
 * @public
 */
export declare function createScaffolderFieldExtension<TReturnValue = unknown, TInputProps = unknown>(options: FieldExtensionOptions<TReturnValue, TInputProps>): Extension<FieldExtensionComponent<TReturnValue, TInputProps>>;

/**
 * Field validation type for Custom Field Extensions.
 *
 * @public
 */
export declare type CustomFieldValidator<TFieldReturnValue> = (data: TFieldReturnValue, field: FieldValidation, context: {
    apiHolder: ApiHolder;
}) => void;

/**
 * The field extension for selecting a name for a new Entity in the Catalog.
 *
 * @public
 */
export declare const EntityNamePickerFieldExtension: FieldExtensionComponent<string, {}>;

/**
 * A field extension for selecting an Entity that exists in the Catalog.
 *
 * @public
 */
export declare const EntityPickerFieldExtension: FieldExtensionComponent<string, EntityPickerUiOptions>;

/**
 * The input props that can be specified under `ui:options` for the
 * `EntityPicker` field extension.
 *
 * @public
 */
export declare interface EntityPickerUiOptions {
    allowedKinds?: string[];
    defaultKind?: string;
    allowArbitraryValues?: boolean;
}

/**
 * EntityTagsPickerFieldExtension
 * @public
 */
export declare const EntityTagsPickerFieldExtension: FieldExtensionComponent<string[], EntityTagsPickerUiOptions>;

/**
 * The input props that can be specified under `ui:options` for the
 * `EntityTagsPicker` field extension.
 *
 * @public
 */
export declare interface EntityTagsPickerUiOptions {
    kinds?: string[];
}

/**
 * A type used to wrap up the FieldExtension to embed the ReturnValue and the InputProps
 *
 * @public
 */
export declare type FieldExtensionComponent<_TReturnValue, _TInputProps> = () => null;

/**
 * Type for field extensions and being able to type
 * incoming props easier.
 *
 * @public
 */
export declare interface FieldExtensionComponentProps<TFieldReturnValue, TUiOptions extends {} = {}> extends FieldProps<TFieldReturnValue> {
    uiSchema: FieldProps['uiSchema'] & {
        'ui:options'?: TUiOptions;
    };
}

/**
 * Type for the Custom Field Extension with the
 * name and components and validation function.
 *
 * @public
 */
export declare type FieldExtensionOptions<TFieldReturnValue = unknown, TInputProps = unknown> = {
    name: string;
    component: (props: FieldExtensionComponentProps<TFieldReturnValue, TInputProps>) => JSX.Element | null;
    validation?: CustomFieldValidator<TFieldReturnValue>;
};

/**
 * The response shape for the `listActions` call to the `scaffolder-backend`
 *
 * @public
 */
export declare type ListActionsResponse = Array<{
    id: string;
    description?: string;
    schema?: {
        input?: JSONSchema7;
        output?: JSONSchema7;
    };
}>;

/**
 * The shape of a `LogEvent` message from the `scaffolder-backend`
 *
 * @public
 */
export declare type LogEvent = {
    type: 'log' | 'completion';
    body: {
        message: string;
        stepId?: string;
        status?: ScaffolderTaskStatus;
    };
    createdAt: string;
    id: string;
    taskId: string;
};

/**
 * The Props for the Scaffolder Router
 *
 * @alpha
 */
export declare type NextRouterProps = {
    components?: {
        TemplateCardComponent?: React_2.ComponentType<{
            template: TemplateEntityV1beta3;
        }>;
        TaskPageComponent?: React_2.ComponentType<{}>;
    };
    groups?: TemplateGroupFilter[];
};

/**
 * @alpha
 * The Router and main entrypoint to the Alpha Scaffolder plugin.
 */
export declare const NextScaffolderPage: (props: PropsWithChildren<NextRouterProps>) => JSX.Element;

/**
 * A field extension to show all the Entities that are owned by the current logged-in User for use in templates.
 *
 * @public
 */
export declare const OwnedEntityPickerFieldExtension: FieldExtensionComponent<string, OwnedEntityPickerUiOptions>;

/**
 * The input props that can be specified under `ui:options` for the
 * `OwnedEntityPicker` field extension.
 *
 * @public
 */
export declare interface OwnedEntityPickerUiOptions {
    allowedKinds?: string[];
    defaultKind?: string;
}

/**
 * A field extension for picking users and groups out of the Catalog.
 *
 * @public
 */
export declare const OwnerPickerFieldExtension: FieldExtensionComponent<string, OwnerPickerUiOptions>;

/**
 * The input props that can be specified under `ui:options` for the
 * `OwnerPicker` field extension.
 *
 * @public
 */
export declare interface OwnerPickerUiOptions {
    allowedKinds?: string[];
}

/**
 * The validation function for the `repoUrl` that is returned from the
 * field extension. Ensures that you have all the required fields filled for
 * the different providers that exist.
 *
 * @public
 */
export declare const repoPickerValidation: (value: string, validation: FieldValidation, context: {
    apiHolder: ApiHolder;
}) => void;

/**
 * The field extension which provides the ability to select a RepositoryUrl.
 * Currently this is an encoded URL that looks something like the following `github.com?repo=myRepoName&owner=backstage`.
 *
 * @public
 */
export declare const RepoUrlPickerFieldExtension: FieldExtensionComponent<string, RepoUrlPickerUiOptions>;

/**
 * The input props that can be specified under `ui:options` for the
 * `RepoUrlPicker` field extension.
 *
 * @public
 */
export declare interface RepoUrlPickerUiOptions {
    allowedHosts?: string[];
    allowedOwners?: string[];
    requestUserCredentials?: {
        secretsKey: string;
        additionalScopes?: {
            gerrit?: string[];
            github?: string[];
            gitlab?: string[];
            bitbucket?: string[];
            azure?: string[];
        };
    };
}

/**
 * The props for the entrypoint `ScaffolderPage` component the plugin.
 * @public
 */
export declare type RouterProps = {
    components?: {
        TemplateCardComponent?: ComponentType<{
            template: TemplateEntityV1beta3;
        }> | undefined;
        TaskPageComponent?: ComponentType<{}>;
    };
    groups?: Array<{
        title?: React_2.ReactNode;
        filter: (entity: Entity) => boolean;
    }>;
    defaultPreviewTemplate?: string;
    /**
     * Options for the context menu on the scaffolder page.
     */
    contextMenu?: {
        /** Whether to show a link to the template editor */
        editor?: boolean;
        /** Whether to show a link to the actions documentation */
        actions?: boolean;
    };
};

/**
 * An API to interact with the scaffolder backend.
 *
 * @public
 */
export declare interface ScaffolderApi {
    getTemplateParameterSchema(templateRef: string): Promise<TemplateParameterSchema>;
    /**
     * Executes the scaffolding of a component, given a template and its
     * parameter values.
     *
     * @param options - The {@link ScaffolderScaffoldOptions} the scaffolding.
     */
    scaffold(options: ScaffolderScaffoldOptions): Promise<ScaffolderScaffoldResponse>;
    getTask(taskId: string): Promise<ScaffolderTask>;
    listTasks?({ filterByOwnership, }: {
        filterByOwnership: 'owned' | 'all';
    }): Promise<{
        tasks: ScaffolderTask[];
    }>;
    getIntegrationsList(options: ScaffolderGetIntegrationsListOptions): Promise<ScaffolderGetIntegrationsListResponse>;
    /**
     * Returns a list of all installed actions.
     */
    listActions(): Promise<ListActionsResponse>;
    streamLogs(options: ScaffolderStreamLogsOptions): Observable<LogEvent>;
    dryRun?(options: ScaffolderDryRunOptions): Promise<ScaffolderDryRunResponse>;
}

/**
 * Utility API reference for the {@link ScaffolderApi}.
 *
 * @public
 */
export declare const scaffolderApiRef: ApiRef<ScaffolderApi>;

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

/** @public */
export declare interface ScaffolderDryRunOptions {
    template: JsonValue;
    values: JsonObject;
    secrets?: Record<string, string>;
    directoryContents: {
        path: string;
        base64Content: string;
    }[];
}

/** @public */
export declare interface ScaffolderDryRunResponse {
    directoryContents: Array<{
        path: string;
        base64Content: string;
        executable: boolean;
    }>;
    log: Array<Pick<LogEvent, 'body'>>;
    steps: TaskStep[];
    output: ScaffolderTaskOutput;
}

/**
 * The Wrapping component for defining fields extensions inside
 *
 * @public
 */
export declare const ScaffolderFieldExtensions: React_2.ComponentType;

/**
 * The arguments for `getIntegrationsList`.
 *
 * @public
 */
export declare interface ScaffolderGetIntegrationsListOptions {
    allowedHosts: string[];
}

/**
 * The response shape for `getIntegrationsList`.
 *
 * @public
 */
export declare interface ScaffolderGetIntegrationsListResponse {
    integrations: {
        type: string;
        title: string;
        host: string;
    }[];
}

/** @public */
export declare type ScaffolderOutputLink = {
    title?: string;
    icon?: string;
    url?: string;
    entityRef?: string;
};

/**
 * The Router and main entrypoint to the Scaffolder plugin.
 *
 * @public
 */
export declare const ScaffolderPage: (props: RouterProps) => JSX.Element;

/**
 * The main plugin export for the scaffolder.
 * @public
 */
export declare const scaffolderPlugin: BackstagePlugin<    {
root: RouteRef<undefined>;
}, {
registerComponent: ExternalRouteRef<undefined, true>;
}>;

/**
 * The input options to the `scaffold` method of the `ScaffolderClient`.
 *
 * @public
 */
export declare interface ScaffolderScaffoldOptions {
    templateRef: string;
    values: Record<string, JsonValue>;
    secrets?: Record<string, string>;
}

/**
 * The response shape of the `scaffold` method of the `ScaffolderClient`.
 *
 * @public
 */
export declare interface ScaffolderScaffoldResponse {
    taskId: string;
}

/**
 * The input options to the `streamLogs` method of the `ScaffolderClient`.
 *
 * @public
 */
export declare interface ScaffolderStreamLogsOptions {
    taskId: string;
    after?: number;
}

/**
 * The shape of each task returned from the `scaffolder-backend`
 *
 * @public
 */
export declare type ScaffolderTask = {
    id: string;
    spec: TaskSpec;
    status: 'failed' | 'completed' | 'processing' | 'open' | 'cancelled';
    lastHeartbeatAt: string;
    createdAt: string;
};

/** @public */
export declare type ScaffolderTaskOutput = {
    links?: ScaffolderOutputLink[];
} & {
    [key: string]: unknown;
};

/**
 * The status of each task in a Scaffolder Job
 *
 * @public
 */
export declare type ScaffolderTaskStatus = 'open' | 'processing' | 'failed' | 'completed' | 'skipped';

/**
 * The return type from the useTemplateSecrets hook.
 * @public
 */
export declare interface ScaffolderUseTemplateSecrets {
    setSecrets: (input: Record<string, string>) => void;
}

/**
 * TaskPage for showing the status of the taskId provided as a param
 * @param loadingText - Optional loading text shown before a task begins executing.
 *
 * @public
 */
export declare const TaskPage: ({ loadingText }: TaskPageProps) => JSX.Element;

/**
 * TaskPageProps for constructing a TaskPage
 * @param loadingText - Optional loading text shown before a task begins executing.
 *
 * @public
 */
export declare type TaskPageProps = {
    loadingText?: string;
};

/**
 * @alpha
 */
export declare type TemplateGroupFilter = {
    title?: React_2.ReactNode;
    filter: (entity: Entity) => boolean;
};

/**
 * The shape of each entry of parameters which gets rendered
 * as a separate step in the wizard input
 *
 * @public
 */
export declare type TemplateParameterSchema = {
    title: string;
    steps: Array<{
        title: string;
        schema: JsonObject;
    }>;
};

/**
 * The component to select the `type` of `Template` that you will see in the table.
 *
 * @public
 */
export declare const TemplateTypePicker: () => JSX.Element | null;

/**
 * Hook to access the secrets context.
 * @public
 */
export declare const useTemplateSecrets: () => ScaffolderUseTemplateSecrets;

export { }
