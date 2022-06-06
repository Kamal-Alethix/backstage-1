import React from 'react';
import { V1Pod } from '@kubernetes/client-node';
export declare const READY_COLUMNS: PodColumns;
export declare const RESOURCE_COLUMNS: PodColumns;
export declare type PodColumns = 'READY' | 'RESOURCE';
declare type PodsTablesProps = {
    pods: V1Pod[];
    extraColumns?: PodColumns[];
    children?: React.ReactNode;
};
export declare const PodsTable: ({ pods, extraColumns }: PodsTablesProps) => JSX.Element;
export {};
