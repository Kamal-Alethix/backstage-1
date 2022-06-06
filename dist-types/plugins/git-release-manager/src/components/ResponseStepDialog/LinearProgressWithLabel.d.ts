/// <reference types="react" />
import { ResponseStep } from '../../types/types';
export declare function LinearProgressWithLabel(props: {
    progress: number;
    responseSteps: ResponseStep[];
}): JSX.Element;
export declare const testables: {
    ICONS: {
        SUCCESS: string;
        FAILURE: string;
    };
};
