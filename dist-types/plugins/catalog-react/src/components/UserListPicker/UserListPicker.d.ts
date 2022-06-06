/// <reference types="react" />
import { IconComponent } from '@backstage/core-plugin-api';
import { UserListFilterKind } from '../../types';
/** @public */
export declare type CatalogReactUserListPickerClassKey = 'root' | 'title' | 'listIcon' | 'menuItem' | 'groupWrapper';
export declare type ButtonGroup = {
    name: string;
    items: {
        id: 'owned' | 'starred' | 'all';
        label: string;
        icon?: IconComponent;
    }[];
};
/** @public */
export declare type UserListPickerProps = {
    initialFilter?: UserListFilterKind;
    availableFilters?: UserListFilterKind[];
};
/** @public */
export declare const UserListPicker: (props: UserListPickerProps) => JSX.Element;
