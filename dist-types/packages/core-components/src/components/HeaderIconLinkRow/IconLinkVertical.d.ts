import React from 'react';
export declare type IconLinkVerticalProps = {
    color?: 'primary' | 'secondary';
    disabled?: boolean;
    href?: string;
    icon?: React.ReactNode;
    label: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    title?: string;
};
/** @public */
export declare type IconLinkVerticalClassKey = 'link' | 'disabled' | 'primary' | 'secondary' | 'label';
/** @public */
export declare function IconLinkVertical({ color, disabled, href, icon, label, onClick, title, }: IconLinkVerticalProps): JSX.Element;
