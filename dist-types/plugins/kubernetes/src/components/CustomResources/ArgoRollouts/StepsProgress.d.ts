import React from 'react';
import { ArgoRolloutCanaryStep } from './types';
interface StepsProgressProps {
    currentStepIndex: number;
    aborted: boolean;
    steps: ArgoRolloutCanaryStep[];
    children?: React.ReactNode;
}
export declare const StepsProgress: ({ currentStepIndex, aborted, steps, }: StepsProgressProps) => JSX.Element;
export {};
