import React from 'react';
/** @public */
export declare type HeaderLabelClassKey = 'root' | 'label' | 'value';
declare type HeaderLabelContentProps = {
    value: React.ReactNode;
    className: string;
};
declare type HeaderLabelProps = {
    label: string;
    value?: HeaderLabelContentProps['value'];
    url?: string;
};
/**
 * Additional label to main {@link Header}
 *
 * @public
 *
 */
export declare function HeaderLabel(props: HeaderLabelProps): JSX.Element;
export {};
