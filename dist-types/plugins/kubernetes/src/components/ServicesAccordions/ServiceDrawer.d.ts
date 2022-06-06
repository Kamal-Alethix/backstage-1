/// <reference types="react" />
import { V1Service } from '@kubernetes/client-node';
export declare const ServiceDrawer: ({ service, expanded, }: {
    service: V1Service;
    expanded?: boolean | undefined;
}) => JSX.Element;
