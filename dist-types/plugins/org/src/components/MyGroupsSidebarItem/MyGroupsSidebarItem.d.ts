/// <reference types="react" />
import { IconComponent } from '@backstage/core-plugin-api';
/**
 * MyGroupsSidebarItem can be added to your sidebar providing quick access to groups the logged in user is a member of
 *
 * @public
 */
export declare const MyGroupsSidebarItem: (props: {
    singularTitle: string;
    pluralTitle: string;
    icon: IconComponent;
    filter?: Record<string, string | symbol | (string | symbol)[]>;
}) => JSX.Element | null;
