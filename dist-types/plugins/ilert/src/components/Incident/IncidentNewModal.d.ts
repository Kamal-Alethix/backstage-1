/// <reference types="react" />
import { AlertSource } from '../../types';
export declare const IncidentNewModal: ({ isModalOpened, setIsModalOpened, refetchIncidents, initialAlertSource, entityName, }: {
    isModalOpened: boolean;
    setIsModalOpened: (open: boolean) => void;
    refetchIncidents: () => void;
    initialAlertSource?: AlertSource | null | undefined;
    entityName?: string | undefined;
}) => JSX.Element;
