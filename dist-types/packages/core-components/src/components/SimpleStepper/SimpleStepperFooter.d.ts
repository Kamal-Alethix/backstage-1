import { ReactNode, PropsWithChildren } from 'react';
import { StepActions } from './types';
export declare type SimpleStepperFooterClassKey = 'root';
interface CommonBtnProps {
    text?: string;
    handleClick?: () => void;
    stepIndex: number;
}
interface RestartBtnProps extends CommonBtnProps {
}
export declare const RestartBtn: ({ text, handleClick }: RestartBtnProps) => JSX.Element;
export declare type SimpleStepperFooterProps = {
    actions?: StepActions;
    children?: ReactNode;
};
export declare const SimpleStepperFooter: ({ actions, children, }: PropsWithChildren<SimpleStepperFooterProps>) => JSX.Element;
export {};
