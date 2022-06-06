import React from 'react';
import { AlertSource } from '../types';
export declare const useNewIncident: (open: boolean, initialAlertSource?: AlertSource | null | undefined) => readonly [{
    readonly alertSources: AlertSource[];
    readonly alertSource: AlertSource | null;
    readonly summary: string;
    readonly details: string;
    readonly error: Error | undefined;
    readonly isLoading: boolean;
}, {
    readonly setAlertSourcesList: React.Dispatch<React.SetStateAction<AlertSource[]>>;
    readonly setAlertSource: React.Dispatch<React.SetStateAction<AlertSource | null>>;
    readonly setSummary: React.Dispatch<React.SetStateAction<string>>;
    readonly setDetails: React.Dispatch<React.SetStateAction<string>>;
    readonly setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    readonly retry: () => void;
}];
