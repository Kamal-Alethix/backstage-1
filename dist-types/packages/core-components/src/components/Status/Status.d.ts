import { PropsWithChildren } from 'react';
export declare type StatusClassKey = 'status' | 'ok' | 'warning' | 'error' | 'pending' | 'running' | 'aborted';
export declare function StatusOK(props: PropsWithChildren<{}>): JSX.Element;
export declare function StatusWarning(props: PropsWithChildren<{}>): JSX.Element;
export declare function StatusError(props: PropsWithChildren<{}>): JSX.Element;
export declare function StatusPending(props: PropsWithChildren<{}>): JSX.Element;
export declare function StatusRunning(props: PropsWithChildren<{}>): JSX.Element;
export declare function StatusAborted(props: PropsWithChildren<{}>): JSX.Element;
