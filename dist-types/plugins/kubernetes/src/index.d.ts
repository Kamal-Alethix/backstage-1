/**
 * A Backstage plugin that integrates towards Kubernetes
 *
 * @packageDocumentation
 */
export { kubernetesPlugin, kubernetesPlugin as plugin, EntityKubernetesContent, } from './plugin';
export type { EntityKubernetesContentProps } from './plugin';
export { Router, isKubernetesAvailable } from './Router';
export * from './api';
export * from './kubernetes-auth-provider';
export * from './utils/clusterLinks';
export * from './components';
export * from './hooks';
export * from './types';
