import React from 'react';
import { ClusterObjects } from '@backstage/plugin-kubernetes-common';
declare type ErrorPanelProps = {
    entityName: string;
    errorMessage?: string;
    clustersWithErrors?: ClusterObjects[];
    children?: React.ReactNode;
};
export declare const ErrorPanel: ({ entityName, errorMessage, clustersWithErrors, }: ErrorPanelProps) => JSX.Element;
export {};
