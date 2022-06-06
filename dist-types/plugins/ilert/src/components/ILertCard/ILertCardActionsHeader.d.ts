/// <reference types="react" />
import { AlertSource, UptimeMonitor } from '../../types';
export declare const ILertCardActionsHeader: ({ alertSource, setAlertSource, setIsNewIncidentModalOpened, setIsMaintenanceModalOpened, uptimeMonitor, }: {
    alertSource: AlertSource | null;
    setAlertSource: (alertSource: AlertSource) => void;
    setIsNewIncidentModalOpened: (isOpen: boolean) => void;
    setIsMaintenanceModalOpened: (isOpen: boolean) => void;
    uptimeMonitor: UptimeMonitor | null;
}) => JSX.Element;
