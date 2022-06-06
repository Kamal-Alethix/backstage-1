import React, { Dispatch, PropsWithChildren, SetStateAction } from 'react';
interface ContextInterface {
    projectId?: number;
    setProjectId?: Dispatch<SetStateAction<number | undefined>>;
}
export declare const Context: React.Context<ContextInterface>;
export declare const ContextProvider: ({ children }: PropsWithChildren<{}>) => JSX.Element;
export {};
