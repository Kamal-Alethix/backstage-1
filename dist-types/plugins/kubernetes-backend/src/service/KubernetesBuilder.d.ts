import { Config } from '@backstage/config';
import express from 'express';
import { Logger } from 'winston';
import { Duration } from 'luxon';
import { ServiceLocatorMethod, CustomResource, KubernetesObjectsProvider, KubernetesClustersSupplier, KubernetesFetcher, KubernetesServiceLocator, KubernetesObjectsProviderOptions } from '../types/types';
export interface KubernetesEnvironment {
    logger: Logger;
    config: Config;
}
/**
 * The return type of the `KubernetesBuilder.build` method
 *
 * @public
 */
export declare type KubernetesBuilderReturn = Promise<{
    router: express.Router;
    clusterSupplier: KubernetesClustersSupplier;
    customResources: CustomResource[];
    fetcher: KubernetesFetcher;
    objectsProvider: KubernetesObjectsProvider;
    serviceLocator: KubernetesServiceLocator;
}>;
export declare class KubernetesBuilder {
    protected readonly env: KubernetesEnvironment;
    private clusterSupplier?;
    private defaultClusterRefreshInterval;
    private objectsProvider?;
    private fetcher?;
    private serviceLocator?;
    static createBuilder(env: KubernetesEnvironment): KubernetesBuilder;
    constructor(env: KubernetesEnvironment);
    build(): KubernetesBuilderReturn;
    setClusterSupplier(clusterSupplier?: KubernetesClustersSupplier): this;
    setDefaultClusterRefreshInterval(refreshInterval: Duration): this;
    setObjectsProvider(objectsProvider?: KubernetesObjectsProvider): this;
    setFetcher(fetcher?: KubernetesFetcher): this;
    setServiceLocator(serviceLocator?: KubernetesServiceLocator): this;
    protected buildCustomResources(): CustomResource[];
    protected buildClusterSupplier(refreshInterval: Duration): KubernetesClustersSupplier;
    protected buildObjectsProvider(options: KubernetesObjectsProviderOptions): KubernetesObjectsProvider;
    protected buildFetcher(): KubernetesFetcher;
    protected buildServiceLocator(method: ServiceLocatorMethod, clusterSupplier: KubernetesClustersSupplier): KubernetesServiceLocator;
    protected buildMultiTenantServiceLocator(clusterSupplier: KubernetesClustersSupplier): KubernetesServiceLocator;
    protected buildHttpServiceLocator(_clusterSupplier: KubernetesClustersSupplier): KubernetesServiceLocator;
    protected buildRouter(objectsProvider: KubernetesObjectsProvider, clusterSupplier: KubernetesClustersSupplier): express.Router;
    protected fetchClusterDetails(clusterSupplier: KubernetesClustersSupplier): Promise<import("../types/types").ClusterDetails[]>;
    protected getServiceLocatorMethod(): ServiceLocatorMethod;
    protected getObjectTypesToFetch(): import("../types/types").ObjectToFetch[] | undefined;
}
