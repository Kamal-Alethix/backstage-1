import React from 'react';
export declare type WarningPanelClassKey = 'panel' | 'summary' | 'summaryText' | 'message' | 'details';
export declare type WarningProps = {
    title?: string;
    severity?: 'warning' | 'error' | 'info';
    message?: React.ReactNode;
    defaultExpanded?: boolean;
    children?: React.ReactNode;
};
/**
 * WarningPanel. Show a user friendly error message to a user similar to
 * ErrorPanel except that the warning panel only shows the warning message to
 * the user.
 *
 * @param severity - Ability to change the severity of the alert. Default value
 *        "warning"
 * @param title - A title for the warning. If not supplied, "Warning" will be
 *        used.
 * @param message - Optional more detailed user-friendly message elaborating on
 *        the cause of the error.
 * @param children - Objects to provide context, such as a stack trace or detailed
 *        error reporting. Will be available inside an unfolded accordion.
 */
export declare function WarningPanel(props: WarningProps): JSX.Element;
