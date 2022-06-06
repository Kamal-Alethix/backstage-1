import React from 'react';
import { ClusterObjects } from '@backstage/plugin-kubernetes-common';
declare type ClusterProps = {
    clusterObjects: ClusterObjects;
    podsWithErrors: Set<string>;
    children?: React.ReactNode;
};
export declare const Cluster: ({ clusterObjects, podsWithErrors }: ClusterProps) => JSX.Element;
export {};
