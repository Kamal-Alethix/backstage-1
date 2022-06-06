import { WithStyles } from '@material-ui/core/styles';
import React from 'react';
import { BackstageTheme } from '@backstage/theme';
/** @public */
export declare type ItemCardHeaderClassKey = 'root';
declare const styles: (theme: BackstageTheme) => import("@material-ui/styles").StyleRules<{}, "root">;
/** @public */
export declare type ItemCardHeaderProps = Partial<WithStyles<typeof styles>> & {
    /**
     * A large title to show in the header, providing the main heading.
     *
     * Use this if you want to have the default styling and placement of a title.
     */
    title?: React.ReactNode;
    /**
     * A slightly smaller title to show in the header, providing additional
     * details.
     *
     * Use this if you want to have the default styling and placement of a
     * subtitle.
     */
    subtitle?: React.ReactNode;
    /**
     * Custom children to draw in the header.
     *
     * If the title and/or subtitle were specified, the children are drawn below
     * those.
     */
    children?: React.ReactNode;
};
/**
 * A simple card header, rendering a default look for "item cards" - cards that
 * are arranged in a grid for users to select among several options.
 *
 * This component expects to be placed within a MUI <CardMedia>.
 *
 * Styles for the header can be overridden using the `classes` prop, e.g.:
 *
 * `<ItemCardHeader title="Hello" classes={{ root: myClassName }} />`
 *
 * @public
 */
export declare function ItemCardHeader(props: ItemCardHeaderProps): JSX.Element;
export {};
