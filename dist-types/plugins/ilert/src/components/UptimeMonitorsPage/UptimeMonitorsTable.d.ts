/// <reference types="react" />
import { TableState } from '../../api';
import { UptimeMonitor } from '../../types';
export declare const UptimeMonitorsTable: ({ uptimeMonitors, tableState, isLoading, onChangePage, onChangeRowsPerPage, onUptimeMonitorChanged, }: {
    uptimeMonitors: UptimeMonitor[];
    tableState: TableState;
    isLoading: boolean;
    onChangePage: (page: number) => void;
    onChangeRowsPerPage: (pageSize: number) => void;
    onUptimeMonitorChanged: (uptimeMonitor: UptimeMonitor) => void;
}) => JSX.Element;
