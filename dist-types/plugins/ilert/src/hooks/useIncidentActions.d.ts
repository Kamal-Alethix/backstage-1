import React from 'react';
import { Incident, IncidentAction } from '../types';
export declare const useIncidentActions: (incident: Incident | null, open: boolean) => readonly [{
    readonly incidentActions: IncidentAction[];
    readonly error: Error | undefined;
    readonly isLoading: boolean;
}, {
    readonly setIncidentActionsList: React.Dispatch<React.SetStateAction<IncidentAction[]>>;
    readonly setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    readonly retry: (() => void) | (() => void) | (() => void) | (() => void);
}];
