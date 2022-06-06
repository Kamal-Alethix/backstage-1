/// <reference types="react" />
import { AlertSource } from '../../types';
export declare const ILertCardMaintenanceModal: ({ alertSource, refetchAlertSource, isModalOpened, setIsModalOpened, }: {
    alertSource: AlertSource | null;
    refetchAlertSource: () => void;
    isModalOpened: boolean;
    setIsModalOpened: (isModalOpened: boolean) => void;
}) => JSX.Element | null;
