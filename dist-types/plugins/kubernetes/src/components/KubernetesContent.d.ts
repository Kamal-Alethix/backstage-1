import React from 'react';
import { Entity } from '@backstage/catalog-model';
declare type KubernetesContentProps = {
    entity: Entity;
    refreshIntervalMs?: number;
    children?: React.ReactNode;
};
export declare const KubernetesContent: ({ entity, refreshIntervalMs, }: KubernetesContentProps) => JSX.Element;
export {};
