import React, { PropsWithChildren } from 'react';
declare type InternalState = {
    stepperLength: number;
    stepIndex: number;
    setStepIndex: any;
    stepHistory: number[];
    setStepHistory: any;
    onStepChange?: (prevIndex: number, nextIndex: number) => void;
};
export declare const VerticalStepperContext: React.Context<InternalState>;
export interface StepperProps {
    elevated?: boolean;
    onStepChange?: (prevIndex: number, nextIndex: number) => void;
    activeStep?: number;
}
export declare function SimpleStepper(props: PropsWithChildren<StepperProps>): JSX.Element;
export {};
