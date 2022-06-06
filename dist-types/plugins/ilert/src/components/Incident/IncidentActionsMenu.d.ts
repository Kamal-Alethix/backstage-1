/// <reference types="react" />
import { Incident } from '../../types';
export declare const IncidentActionsMenu: ({ incident, onIncidentChanged, setIsLoading, }: {
    incident: Incident;
    onIncidentChanged?: ((incident: Incident) => void) | undefined;
    setIsLoading?: ((isLoading: boolean) => void) | undefined;
}) => JSX.Element;
