import React from 'react';
import { V1HorizontalPodAutoscaler } from '@kubernetes/client-node';
export declare const HorizontalPodAutoscalerDrawer: ({ hpa, expanded, children, }: {
    hpa: V1HorizontalPodAutoscaler;
    expanded?: boolean | undefined;
    children?: React.ReactNode;
}) => JSX.Element;
