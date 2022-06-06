import { ConfigApi, DiscoveryApi } from '@backstage/core-plugin-api';
import { AggregatedError, NotFoundInInstance } from '../types';
/** @public */
export declare type PeriskopApiOptions = {
    discoveryApi: DiscoveryApi;
    configApi: ConfigApi;
};
/**
 * API abstraction to interact with Periskop's backends.
 *
 * @public
 */
export interface PeriskopApi {
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
export declare class PeriskopClient implements PeriskopApi {
    private readonly discoveryApi;
    private readonly instances;
    constructor(options: PeriskopApiOptions);
    private getApiUrl;
    getInstanceNames(): string[];
    getErrorInstanceUrl(instanceName: string, serviceName: string, error: AggregatedError): string;
    getErrors(instanceName: string, serviceName: string): Promise<AggregatedError[] | NotFoundInInstance>;
}
