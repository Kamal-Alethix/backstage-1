import React from 'react';
import { AlertSource, UptimeMonitor } from '../types';
export declare const useAlertSource: (integrationKey: string) => readonly [{
    readonly alertSource: AlertSource | null;
    readonly uptimeMonitor: UptimeMonitor | null;
    readonly error: Error | undefined;
    readonly isLoading: boolean;
}, {
    readonly retry: () => void;
    readonly setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    readonly refetchAlertSource: () => Promise<void>;
    readonly setAlertSource: React.Dispatch<React.SetStateAction<AlertSource | null>>;
}];
