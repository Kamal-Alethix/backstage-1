/// <reference types="react" />
import { ResponseStep } from '../../types/types';
interface ResponseStepListItemProps {
    responseStep: ResponseStep;
    index: number;
    animationDelay?: number;
}
export declare const ResponseStepListItem: ({ responseStep, animationDelay, }: ResponseStepListItemProps) => JSX.Element;
export {};
