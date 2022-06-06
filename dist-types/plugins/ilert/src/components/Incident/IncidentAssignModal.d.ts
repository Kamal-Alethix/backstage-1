/// <reference types="react" />
import { Incident } from '../../types';
export declare const IncidentAssignModal: ({ incident, isModalOpened, setIsModalOpened, onIncidentChanged, }: {
    incident: Incident | null;
    isModalOpened: boolean;
    setIsModalOpened: (open: boolean) => void;
    onIncidentChanged?: ((incident: Incident) => void) | undefined;
}) => JSX.Element;
