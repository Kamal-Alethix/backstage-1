import React, { PropsWithChildren } from 'react';
interface StyledTabsProps {
    value: number | boolean;
    selectionFollowsFocus: boolean;
    onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}
export declare type TabBarClassKey = 'indicator' | 'flexContainer' | 'root';
export declare const StyledTabs: (props: PropsWithChildren<StyledTabsProps>) => JSX.Element;
export {};
