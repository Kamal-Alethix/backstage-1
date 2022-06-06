import React from 'react';
/**
 * Props for {@link AboutField}.
 *
 * @public
 */
export interface AboutFieldProps {
    label: string;
    value?: string;
    gridSizes?: Record<string, number>;
    children?: React.ReactNode;
}
/** @public */
export declare function AboutField(props: AboutFieldProps): JSX.Element;
