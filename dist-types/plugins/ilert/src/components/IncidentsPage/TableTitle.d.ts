/// <reference types="react" />
import { IncidentStatus } from '../../types';
export declare const TableTitle: ({ incidentStates, onIncidentStatesChange, }: {
    incidentStates: IncidentStatus[];
    onIncidentStatesChange: (states: IncidentStatus[]) => void;
}) => JSX.Element;
