import { Entity } from '@backstage/catalog-model';
import { IconComponent } from '@backstage/core-plugin-api';
import { TabProps } from '@material-ui/core';
import React from 'react';
/** @public */
export declare type EntityLayoutRouteProps = {
    path: string;
    title: string;
    children: JSX.Element;
    if?: (entity: Entity) => boolean;
    tabProps?: TabProps<React.ElementType, {
        component?: React.ElementType;
    }>;
};
interface ExtraContextMenuItem {
    title: string;
    Icon: IconComponent;
    onClick: () => void;
}
interface contextMenuOptions {
    disableUnregister: boolean;
}
/** @public */
export interface EntityLayoutProps {
    UNSTABLE_extraContextMenuItems?: ExtraContextMenuItem[];
    UNSTABLE_contextMenuOptions?: contextMenuOptions;
    children?: React.ReactNode;
    NotFoundComponent?: React.ReactNode;
}
/**
 * EntityLayout is a compound component, which allows you to define a layout for
 * entities using a sub-navigation mechanism.
 *
 * Consists of two parts: EntityLayout and EntityLayout.Route
 *
 * @example
 * ```jsx
 * <EntityLayout>
 *   <EntityLayout.Route path="/example" title="Example tab">
 *     <div>This is rendered under /example/anything-here route</div>
 *   </EntityLayout.Route>
 * </EntityLayout>
 * ```
 *
 * @public
 */
export declare const EntityLayout: {
    (props: EntityLayoutProps): JSX.Element;
    Route: (props: EntityLayoutRouteProps) => null;
};
export {};
