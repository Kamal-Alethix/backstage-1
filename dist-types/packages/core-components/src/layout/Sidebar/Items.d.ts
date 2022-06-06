import { IconComponent } from '@backstage/core-plugin-api';
import { StyledComponentProps } from '@material-ui/core/styles/withStyles';
import React, { ReactNode } from 'react';
import { NavLinkProps } from 'react-router-dom';
/** @public */
export declare type SidebarItemClassKey = 'root' | 'buttonItem' | 'closed' | 'open' | 'highlightable' | 'highlighted' | 'label' | 'iconContainer' | 'searchRoot' | 'searchField' | 'searchFieldHTMLInput' | 'searchContainer' | 'secondaryAction' | 'closedItemIcon' | 'submenuArrow' | 'expandButton' | 'arrows' | 'selected';
declare type SidebarItemBaseProps = {
    icon: IconComponent;
    text?: string;
    hasNotifications?: boolean;
    hasSubmenu?: boolean;
    disableHighlight?: boolean;
    className?: string;
};
declare type SidebarItemButtonProps = SidebarItemBaseProps & {
    onClick: (ev: React.MouseEvent) => void;
    children?: ReactNode;
};
declare type SidebarItemLinkProps = SidebarItemBaseProps & {
    to: string;
    onClick?: (ev: React.MouseEvent) => void;
} & NavLinkProps;
declare type SidebarItemWithSubmenuProps = SidebarItemBaseProps & {
    to?: string;
    onClick?: (ev: React.MouseEvent) => void;
    children: ReactNode;
};
/**
 * SidebarItem with 'to' property will be a clickable link.
 * SidebarItem with 'onClick' property and without 'to' property will be a clickable button.
 * SidebarItem which wraps a SidebarSubmenu will be a clickable button which opens a submenu.
 */
declare type SidebarItemProps = SidebarItemLinkProps | SidebarItemButtonProps | SidebarItemWithSubmenuProps;
export declare const WorkaroundNavLink: React.ForwardRefExoticComponent<NavLinkProps & React.RefAttributes<HTMLAnchorElement>>;
/**
 * Creates a `SidebarItem`
 *
 * If children contain a `SidebarSubmenu` component the `SidebarItem` will have a expandable submenu
 */
export declare const SidebarItem: (props: SidebarItemProps) => JSX.Element;
declare type SidebarSearchFieldProps = {
    onSearch: (input: string) => void;
    to?: string;
    icon?: IconComponent;
};
export declare function SidebarSearchField(props: SidebarSearchFieldProps): JSX.Element;
export declare type SidebarSpaceClassKey = 'root';
export declare const SidebarSpace: React.ComponentType<React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> & StyledComponentProps<"root">>;
export declare type SidebarSpacerClassKey = 'root';
export declare const SidebarSpacer: React.ComponentType<React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> & StyledComponentProps<"root">>;
export declare type SidebarDividerClassKey = 'root';
export declare const SidebarDivider: React.ComponentType<React.ClassAttributes<HTMLHRElement> & React.HTMLAttributes<HTMLHRElement> & StyledComponentProps<"root">>;
export declare const SidebarScrollWrapper: React.ComponentType<React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> & StyledComponentProps<"root">>;
/**
 * A button which allows you to expand the sidebar when clicked.
 * Use optionally to replace sidebar's expand-on-hover feature with expand-on-click.
 *
 * If you are using this you might want to set the `disableExpandOnHover` of the `Sidebar` to `true`.
 *
 * @public
 */
export declare const SidebarExpandButton: () => JSX.Element | null;
export {};
