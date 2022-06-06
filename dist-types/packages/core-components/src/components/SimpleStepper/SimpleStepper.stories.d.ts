/// <reference types="react" />
import { SimpleStepper, StepperProps } from './SimpleStepper';
declare const _default: {
    title: string;
    component: typeof SimpleStepper;
};
export default _default;
export declare const Default: {
    (args: StepperProps): JSX.Element;
    args: {
        elevated: boolean;
        activeStep: number;
    };
};
export declare const ConditionalButtons: {
    (args: StepperProps): JSX.Element;
    args: {
        elevated: boolean;
        activeStep: number;
    };
};
export declare const CompletionStep: {
    (args: StepperProps): JSX.Element;
    args: {
        elevated: boolean;
        activeStep: number;
    };
};
