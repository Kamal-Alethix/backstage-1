/// <reference types="react" />
import { Incident } from '../types';
declare type Props = {
    team: string;
    incident: Incident;
    onIncidentAction: () => void;
    readOnly: boolean;
};
export declare const IncidentListItem: ({ incident, readOnly, onIncidentAction, team, }: Props) => JSX.Element;
export {};
