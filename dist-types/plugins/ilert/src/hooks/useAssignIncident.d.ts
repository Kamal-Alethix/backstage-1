import React from 'react';
import { Incident, IncidentResponder } from '../types';
export declare const useAssignIncident: (incident: Incident | null, open: boolean) => readonly [{
    readonly incidentRespondersList: IncidentResponder[];
    readonly incidentResponder: IncidentResponder | null;
    readonly error: Error | undefined;
    readonly isLoading: boolean;
}, {
    readonly setIncidentRespondersList: React.Dispatch<React.SetStateAction<IncidentResponder[]>>;
    readonly setIncidentResponder: React.Dispatch<React.SetStateAction<IncidentResponder | null>>;
    readonly setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    readonly retry: (() => void) | (() => void) | (() => void) | (() => void);
}];
