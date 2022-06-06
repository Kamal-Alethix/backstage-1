/// <reference types="react" />
/**
 * Displays alerts from {@link @backstage/core-plugin-api#AlertApi}
 *
 * @public
 * @remarks
 *
 * Shown as SnackBar at the center top of the page by default. Configurable with props.
 */
export declare type AlertDisplayProps = {
    anchorOrigin?: {
        vertical: 'top' | 'bottom';
        horizontal: 'left' | 'center' | 'right';
    };
};
/** @public */
export declare function AlertDisplay(props: AlertDisplayProps): JSX.Element | null;
