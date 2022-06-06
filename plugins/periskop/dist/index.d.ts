/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { DiscoveryApi, ConfigApi } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';

/** @public */
interface AggregatedError {
    aggregation_key: string;
    total_count: number;
    severity: string;
    latest_errors: ErrorInstance[];
}
/** @public */
interface ErrorInstance {
    error: Error;
    uuid: string;
    timestamp: number;
    severity: string;
    http_context: HttpContext;
}
/** @public */
interface Error {
    class: string;
    message: string;
    stacktrace?: string[];
    cause?: Error | null;
}
/** @public */
interface HttpContext {
    request_method: string;
    request_url: string;
    request_headers: RequestHeaders;
    request_body: string;
}
/** @public */
interface RequestHeaders {
    [k: string]: string;
}
/** @public */
interface NotFoundInInstance {
    body: string;
}

/** @public */
declare type PeriskopApiOptions = {
    discoveryApi: DiscoveryApi;
    configApi: ConfigApi;
};
/**
 * API abstraction to interact with Periskop's backends.
 *
 * @public
 */
interface PeriskopApi {
    /**
     * Returns the list of registered Periskop instance names.
     */
    getInstanceNames(): string[];
    /**
     * For the given instance and service, returns the URL pointing to the specific error instance occurrence.
     * Note: This method might point to an external route.
     */
    getErrorInstanceUrl(instanceName: string, serviceName: string, error: AggregatedError): string;
    /**
     * Fetches all errors for the given service from the specified Periskop instance, given its name.
     */
    getErrors(instanceName: string, serviceName: string): Promise<AggregatedError[] | NotFoundInInstance>;
}
/**
 * API implementation to interact with Periskop's backends.
 *
 * @public
 */
declare class PeriskopClient implements PeriskopApi {
    private readonly discoveryApi;
    private readonly instances;
    constructor(options: PeriskopApiOptions);
    private getApiUrl;
    getInstanceNames(): string[];
    getErrorInstanceUrl(instanceName: string, serviceName: string, error: AggregatedError): string;
    getErrors(instanceName: string, serviceName: string): Promise<AggregatedError[] | NotFoundInInstance>;
}

/**
 * @public
 */
declare const periskopApiRef: _backstage_core_plugin_api.ApiRef<PeriskopApi>;
/**
 * @public
 */
declare const periskopPlugin: _backstage_core_plugin_api.BackstagePlugin<{}, {}>;

/**
 * @public
 */
declare const EntityPeriskopErrorsCard: () => JSX.Element;

/**
 * Constant storing Periskop project name.
 *
 * @public
 */
declare const PERISKOP_NAME_ANNOTATION = "periskop.io/service-name";
/**
 * Returns true if Periskop annotation is present in the given entity.
 *
 * @public
 */
declare const isPeriskopAvailable: (entity: Entity) => boolean;

export { AggregatedError, EntityPeriskopErrorsCard, Error, ErrorInstance, HttpContext, NotFoundInInstance, PERISKOP_NAME_ANNOTATION, PeriskopApi, PeriskopApiOptions, PeriskopClient, RequestHeaders, isPeriskopAvailable, periskopApiRef, periskopPlugin };
