import { CardHeaderProps } from '@material-ui/core/CardHeader';
import { ReactNode } from 'react';
import { BottomLinkProps } from '../BottomLink';
import { ErrorBoundaryProps } from '../ErrorBoundary';
/** @public */
export declare type InfoCardClassKey = 'noPadding' | 'header' | 'headerTitle' | 'headerSubheader' | 'headerAvatar' | 'headerAction' | 'headerContent';
/** @public */
export declare type CardActionsTopRightClassKey = 'root';
/** @public */
export declare type InfoCardVariants = 'flex' | 'fullHeight' | 'gridItem';
/**
 * InfoCard is used to display a paper-styled block on the screen, similar to a panel.
 *
 * You can custom style an InfoCard with the 'className' (outer container) and 'cardClassName' (inner container)
 * props. This is typically used with the material-ui makeStyles mechanism.
 *
 * The InfoCard serves as an error boundary. As a result, if you provide an 'errorBoundaryProps' property this
 * specifies the extra information to display in the error component that is displayed if an error occurs
 * in any descendent components.
 *
 * By default the InfoCard has no custom layout of its children, but is treated as a block element. A
 * couple common variants are provided and can be specified via the variant property:
 *
 * When the InfoCard is displayed as a grid item within a grid, you may want items to have the same height for all items.
 * Set to the 'gridItem' variant to display the InfoCard with full height suitable for Grid:
 *
 * `<InfoCard variant="gridItem">...</InfoCard>`
 */
export declare type Props = {
    title?: ReactNode;
    subheader?: ReactNode;
    divider?: boolean;
    deepLink?: BottomLinkProps;
    /** @deprecated Use errorBoundaryProps instead */
    slackChannel?: string;
    errorBoundaryProps?: ErrorBoundaryProps;
    variant?: InfoCardVariants;
    children?: ReactNode;
    headerStyle?: object;
    headerProps?: CardHeaderProps;
    icon?: ReactNode;
    action?: ReactNode;
    actionsClassName?: string;
    actions?: ReactNode;
    cardClassName?: string;
    actionsTopRight?: ReactNode;
    className?: string;
    noPadding?: boolean;
    titleTypographyProps?: object;
};
/**
 * Material-ui card with header , content and actions footer
 *
 * @public
 *
 */
export declare function InfoCard(props: Props): JSX.Element;
