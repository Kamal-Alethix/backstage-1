import React from 'react';
import { Schedule } from '../types';
export declare const useOnCallSchedules: () => readonly [{
    readonly onCallSchedules: Schedule[];
    readonly error: Error | undefined;
    readonly isLoading: boolean;
}, {
    readonly retry: (() => void) | (() => void) | (() => void) | (() => void);
    readonly setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    readonly refetchOnCallSchedules: () => Promise<void>;
}];
