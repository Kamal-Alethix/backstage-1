import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { KubernetesClustersSupplier } from '../types/types';
import express from 'express';
export interface RouterOptions {
    logger: Logger;
    config: Config;
    clusterSupplier?: KubernetesClustersSupplier;
}
/**
 * creates and configure a new router for handling the kubernetes backend APIs
 * @param options - specifies the options required by this plugin
 * @returns a new router
 * @deprecated Please use the new KubernetesBuilder instead like this
 * ```
 * import { KubernetesBuilder } from '@backstage/plugin-kubernetes-backend';
 * const { router } = await KubernetesBuilder.createBuilder({
 *   logger,
 *   config,
 * }).build();
 * ```
 */
export declare function createRouter(options: RouterOptions): Promise<express.Router>;
