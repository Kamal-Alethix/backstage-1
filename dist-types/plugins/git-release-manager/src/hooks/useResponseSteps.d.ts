import { ResponseStep } from '../types/types';
export declare function useResponseSteps(): {
    responseSteps: ResponseStep[];
    addStepToResponseSteps: (responseStep: ResponseStep) => void;
    asyncCatcher: (error: Error) => never;
    abortIfError: (error?: Error | undefined) => void;
};
