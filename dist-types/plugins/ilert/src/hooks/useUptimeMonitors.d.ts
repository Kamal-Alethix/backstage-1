import React from 'react';
import { TableState } from '../api';
import { UptimeMonitor } from '../types';
export declare const useUptimeMonitors: () => readonly [{
    readonly tableState: TableState;
    readonly uptimeMonitors: UptimeMonitor[];
    readonly error: Error | undefined;
    readonly isLoading: boolean;
}, {
    readonly setTableState: React.Dispatch<React.SetStateAction<TableState>>;
    readonly setUptimeMonitorsList: React.Dispatch<React.SetStateAction<UptimeMonitor[]>>;
    readonly retry: (() => void) | (() => void) | (() => void) | (() => void);
    readonly onUptimeMonitorChanged: (newUptimeMonitor: UptimeMonitor) => void;
    readonly onChangePage: (page: number) => void;
    readonly onChangeRowsPerPage: (pageSize: number) => void;
    readonly setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}];
