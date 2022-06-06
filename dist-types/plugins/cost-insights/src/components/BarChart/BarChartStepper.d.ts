/// <reference types="react" />
declare type BarChartStepperProps = {
    disableScroll: boolean;
    steps: number;
    onChange: (activeStep: number) => void;
};
export declare const BarChartStepper: ({ steps, disableScroll, onChange, }: BarChartStepperProps) => JSX.Element;
export {};
