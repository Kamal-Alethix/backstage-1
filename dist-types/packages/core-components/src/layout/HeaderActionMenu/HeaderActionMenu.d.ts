import React, { ReactElement, ComponentType } from 'react';
import { ListItemTextProps } from '@material-ui/core/ListItemText';
declare type ActionItemProps = {
    label?: ListItemTextProps['primary'];
    secondaryLabel?: ListItemTextProps['secondary'];
    icon?: ReactElement;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    WrapperComponent?: ComponentType;
};
export declare type HeaderActionMenuProps = {
    actionItems: ActionItemProps[];
};
export declare function HeaderActionMenu(props: HeaderActionMenuProps): JSX.Element;
export {};
