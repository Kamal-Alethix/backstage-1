import React from 'react';
import { TableState } from '../api';
import { Incident, IncidentStatus, AlertSource } from '../types';
export declare const useIncidents: (paging: boolean, singleSource?: boolean | undefined, alertSource?: AlertSource | null | undefined) => readonly [{
    readonly tableState: TableState;
    readonly states: IncidentStatus[];
    readonly incidents: Incident[];
    readonly incidentsCount: number;
    readonly error: Error | undefined;
    readonly isLoading: boolean;
}, {
    readonly setTableState: React.Dispatch<React.SetStateAction<TableState>>;
    readonly setStates: React.Dispatch<React.SetStateAction<IncidentStatus[]>>;
    readonly setIncidentsList: React.Dispatch<React.SetStateAction<Incident[]>>;
    readonly setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    readonly retry: () => void;
    readonly onIncidentChanged: (newIncident: Incident) => void;
    readonly refetchIncidents: () => void;
    readonly onChangePage: (page: number) => void;
    readonly onChangeRowsPerPage: (p: number) => void;
    readonly onIncidentStatesChange: (s: IncidentStatus[]) => void;
}];
