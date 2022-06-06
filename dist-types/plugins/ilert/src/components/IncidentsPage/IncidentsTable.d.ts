/// <reference types="react" />
import { TableState } from '../../api';
import { Incident, IncidentStatus } from '../../types';
export declare const IncidentsTable: ({ incidents, incidentsCount, tableState, states, isLoading, onIncidentChanged, setIsLoading, onIncidentStatesChange, onChangePage, onChangeRowsPerPage, compact, }: {
    incidents: Incident[];
    incidentsCount: number;
    tableState: TableState;
    states: IncidentStatus[];
    isLoading: boolean;
    onIncidentChanged: (incident: Incident) => void;
    setIsLoading: (isLoading: boolean) => void;
    onIncidentStatesChange: (states: IncidentStatus[]) => void;
    onChangePage: (page: number) => void;
    onChangeRowsPerPage: (pageSize: number) => void;
    compact?: boolean | undefined;
}) => JSX.Element;
