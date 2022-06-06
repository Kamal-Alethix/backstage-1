import React from 'react';
import { AppContext } from '../app/types';
import { BackstagePlugin } from '../plugin';
declare type Props = {
    app: AppContext;
    plugin: BackstagePlugin;
};
declare type State = {
    error: Error | undefined;
};
export declare class PluginErrorBoundary extends React.Component<Props, State> {
    static getDerivedStateFromError(error: Error): {
        error: Error;
    };
    state: State;
    handleErrorReset: () => void;
    render(): React.ReactNode;
}
export {};
