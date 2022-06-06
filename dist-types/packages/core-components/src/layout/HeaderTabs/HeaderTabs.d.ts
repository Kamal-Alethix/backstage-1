import { TabProps } from '@material-ui/core/Tab';
import React from 'react';
/** @public */
export declare type HeaderTabsClassKey = 'tabsWrapper' | 'defaultTab' | 'selected' | 'tabRoot';
export declare type Tab = {
    id: string;
    label: string;
    tabProps?: TabProps<React.ElementType, {
        component?: React.ElementType;
    }>;
};
declare type HeaderTabsProps = {
    tabs: Tab[];
    onChange?: (index: number) => void;
    selectedIndex?: number;
};
/**
 * Horizontal Tabs component
 *
 * @public
 *
 */
export declare function HeaderTabs(props: HeaderTabsProps): JSX.Element;
export {};
