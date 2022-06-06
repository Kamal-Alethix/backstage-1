import React from 'react';
import { AlertSource, OnCall } from '../types';
export declare const useAlertSourceOnCalls: (alertSource?: AlertSource | null | undefined) => readonly [{
    readonly onCalls: OnCall[];
    readonly error: Error | undefined;
    readonly isLoading: boolean;
}, {
    readonly retry: (() => void) | (() => void) | (() => void) | (() => void);
    readonly setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    readonly refetchAlertSourceOnCalls: () => Promise<void>;
}];
