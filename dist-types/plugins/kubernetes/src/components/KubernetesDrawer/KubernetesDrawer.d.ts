import React from 'react';
import { V1ObjectMeta } from '@kubernetes/client-node';
import { ClusterAttributes } from '@backstage/plugin-kubernetes-common';
declare type ErrorPanelProps = {
    cluster: ClusterAttributes;
    errorMessage?: string;
    children?: React.ReactNode;
};
export declare const ErrorPanel: ({ cluster, errorMessage }: ErrorPanelProps) => JSX.Element;
interface KubernetesDrawerable {
    metadata?: V1ObjectMeta;
}
interface KubernetesDrawerProps<T extends KubernetesDrawerable> {
    object: T;
    renderObject: (obj: T) => object;
    buttonVariant?: 'h5' | 'subtitle2';
    kind: string;
    expanded?: boolean;
    children?: React.ReactNode;
}
export declare const KubernetesDrawer: <T extends KubernetesDrawerable>({ object, renderObject, kind, buttonVariant, expanded, children, }: KubernetesDrawerProps<T>) => JSX.Element;
export {};
