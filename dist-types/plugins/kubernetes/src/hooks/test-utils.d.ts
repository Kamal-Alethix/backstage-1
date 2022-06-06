import React from 'react';
import { ClientPodStatus } from '@backstage/plugin-kubernetes-common';
export declare const kubernetesProviders: (groupedResponses?: any, podsWithErrors?: Set<string>, podNameToMetrics?: Map<string, ClientPodStatus>) => (node: React.ReactNode) => JSX.Element;
