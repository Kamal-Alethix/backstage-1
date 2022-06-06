import { TabProps } from '@material-ui/core/Tab';
import * as React from 'react';
export declare type SubRoute = {
    path: string;
    title: string;
    children: JSX.Element;
    tabProps?: TabProps<React.ElementType, {
        component?: React.ElementType;
    }>;
};
