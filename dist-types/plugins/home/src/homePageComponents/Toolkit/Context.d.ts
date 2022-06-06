import React from 'react';
export declare type Tool = {
    label: string;
    url: string;
    icon: React.ReactNode;
};
declare type ToolkitContextValue = {
    tools: Tool[];
};
declare const Context: React.Context<ToolkitContextValue | undefined>;
export declare const ContextProvider: (props: {
    children: JSX.Element;
    tools: Tool[];
}) => JSX.Element;
export declare const useToolkit: () => ToolkitContextValue | undefined;
export default Context;
