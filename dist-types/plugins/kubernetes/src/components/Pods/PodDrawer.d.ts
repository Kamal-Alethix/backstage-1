/// <reference types="react" />
import { V1Pod } from '@kubernetes/client-node';
export declare const PodDrawer: ({ pod, expanded, }: {
    pod: V1Pod;
    expanded?: boolean | undefined;
}) => JSX.Element;
