/// <reference types="react" />
import { V1StatefulSet } from '@kubernetes/client-node';
export declare const StatefulSetDrawer: ({ statefulset, expanded, }: {
    statefulset: V1StatefulSet;
    expanded?: boolean | undefined;
}) => JSX.Element;
