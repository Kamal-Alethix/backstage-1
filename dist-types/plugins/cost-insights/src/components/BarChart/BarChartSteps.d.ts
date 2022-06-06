/// <reference types="react" />
export declare type BarChartStepsProps = {
    steps: number;
    activeStep: number;
    onClick: (index: number) => void;
};
export declare const BarChartSteps: ({ steps, activeStep, onClick, }: BarChartStepsProps) => JSX.Element;
