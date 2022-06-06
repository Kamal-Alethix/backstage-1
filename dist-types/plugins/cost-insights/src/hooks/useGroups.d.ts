import React, { PropsWithChildren } from 'react';
import { Group } from '../types';
export declare type GroupsContextProps = {
    groups: Group[];
};
export declare const GroupsContext: React.Context<GroupsContextProps | undefined>;
export declare const GroupsProvider: ({ children }: PropsWithChildren<{}>) => JSX.Element | null;
export declare function useGroups(): Group[];
