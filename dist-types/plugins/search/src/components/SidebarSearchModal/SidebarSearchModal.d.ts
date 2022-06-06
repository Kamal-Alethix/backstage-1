/// <reference types="react" />
import { IconComponent } from '@backstage/core-plugin-api';
import { SearchModalChildrenProps } from '../SearchModal';
export declare type SidebarSearchModalProps = {
    icon?: IconComponent;
    children?: (props: SearchModalChildrenProps) => JSX.Element;
};
export declare const SidebarSearchModal: (props: SidebarSearchModalProps) => JSX.Element;
