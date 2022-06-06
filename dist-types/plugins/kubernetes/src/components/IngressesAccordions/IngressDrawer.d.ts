/// <reference types="react" />
import { V1Ingress } from '@kubernetes/client-node';
export declare const IngressDrawer: ({ ingress, expanded, }: {
    ingress: V1Ingress;
    expanded?: boolean | undefined;
}) => JSX.Element;
