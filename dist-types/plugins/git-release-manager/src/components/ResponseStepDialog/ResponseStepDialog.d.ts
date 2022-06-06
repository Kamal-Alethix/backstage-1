/// <reference types="react" />
import { ResponseStep } from '../../types/types';
interface DialogProps {
    progress: number;
    responseSteps: ResponseStep[];
    title: string;
}
export declare const ResponseStepDialog: ({ progress, responseSteps, title, }: DialogProps) => JSX.Element;
export {};
