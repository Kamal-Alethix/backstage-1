import { Theme, WithStyles } from '@material-ui/core/styles';
import React from 'react';
/** @public */
export declare type ItemCardGridClassKey = 'root';
declare const styles: (theme: Theme) => import("@material-ui/styles").StyleRules<{}, "root">;
/** @public */
export declare type ItemCardGridProps = Partial<WithStyles<typeof styles>> & {
    /**
     * The Card items of the grid.
     */
    children?: React.ReactNode;
};
/**
 * A default grid to use when arranging "item cards" - cards that let users
 * select among several options.
 *
 * The immediate children are expected to be MUI Card components.
 *
 * Styles for the grid can be overridden using the `classes` prop, e.g.:
 *
 * `<ItemCardGrid title="Hello" classes={{ root: myClassName }} />`
 *
 * This can be useful for e.g. overriding gridTemplateColumns to adapt the
 * minimum size of the cells to fit the content better.
 *
 * @public
 */
export declare function ItemCardGrid(props: ItemCardGridProps): JSX.Element;
export {};
