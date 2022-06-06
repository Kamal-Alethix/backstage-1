/// <reference types="react" />
import { IconComponent } from '@backstage/core-plugin-api';
/**
 * Clickable item displayed when submenu item is clicked.
 * title: Text content of item
 * to: Path to navigate to when item is clicked
 *
 * @public
 */
export declare type SidebarSubmenuItemDropdownItem = {
    title: string;
    to: string;
};
/**
 * Holds submenu item content.
 *
 * title: Text content of submenu item
 * to: Path to navigate to when item is clicked
 * icon: Icon displayed on the left of text content
 * dropdownItems: Optional array of dropdown items displayed when submenu item is clicked.
 *
 * @public
 */
export declare type SidebarSubmenuItemProps = {
    title: string;
    to?: string;
    icon?: IconComponent;
    dropdownItems?: SidebarSubmenuItemDropdownItem[];
};
/**
 * Item used inside a submenu within the sidebar.
 *
 * @public
 */
export declare const SidebarSubmenuItem: (props: SidebarSubmenuItemProps) => JSX.Element;
