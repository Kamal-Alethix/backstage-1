import { ComponentClass, ErrorInfo } from 'react';
declare type SlackChannel = {
    name: string;
    href?: string;
};
/** @public */
export declare type ErrorBoundaryProps = {
    slackChannel?: string | SlackChannel;
    onError?: (error: Error, errorInfo: string) => null;
};
declare type State = {
    error?: Error;
    errorInfo?: ErrorInfo;
};
/** @public */
export declare const ErrorBoundary: ComponentClass<ErrorBoundaryProps, State>;
export {};
