import { PropsWithChildren } from 'react';
/** @public */
export declare type ErrorPanelClassKey = 'text' | 'divider';
/** @public */
export declare type ErrorPanelProps = {
    error: Error;
    defaultExpanded?: boolean;
    title?: string;
};
/**
 * Renders a warning panel as the effect of an error.
 *
 * @public
 */
export declare function ErrorPanel(props: PropsWithChildren<ErrorPanelProps>): JSX.Element;
