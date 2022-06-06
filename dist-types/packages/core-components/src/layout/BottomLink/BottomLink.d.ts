import React from 'react';
/** @public */
export declare type BottomLinkClassKey = 'root' | 'boxTitle' | 'arrow';
/** @public */
export declare type BottomLinkProps = {
    link: string;
    title: string;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};
/**
 * Footer with link used in  {@link InfoCard } and {@link TabbedCard}
 *
 * @public
 *
 */
export declare function BottomLink(props: BottomLinkProps): JSX.Element;
