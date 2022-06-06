/// <reference types="react" />
import { IconComponent } from '@backstage/core-plugin-api';
export declare type ButtonGroup = {
    name: string;
    items: {
        id: 'owned' | 'starred' | 'all';
        label: string;
        icon?: IconComponent;
    }[];
};
export declare const OwnerListPicker: (props: {
    filter: string;
    onSelectOwner: (id: 'owned' | 'all') => void;
}) => JSX.Element;
