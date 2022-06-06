import { PropsWithChildren } from 'react';
import { ResponseStep } from '../../types/types';
interface ResponseStepListProps {
    responseSteps: (ResponseStep | undefined)[];
    animationDelay?: number;
    loading?: boolean;
    closeable?: boolean;
    denseList?: boolean;
}
export declare const ResponseStepList: ({ responseSteps, animationDelay, loading, denseList, children, }: PropsWithChildren<ResponseStepListProps>) => JSX.Element;
export {};
