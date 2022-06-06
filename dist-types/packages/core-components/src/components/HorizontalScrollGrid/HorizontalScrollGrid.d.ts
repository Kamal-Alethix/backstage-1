import { PropsWithChildren } from 'react';
declare type Props = {
    scrollStep?: number;
    scrollSpeed?: number;
    minScrollDistance?: number;
};
/** @public */
export declare type HorizontalScrollGridClassKey = 'root' | 'container' | 'fade' | 'fadeLeft' | 'fadeRight' | 'fadeHidden' | 'button' | 'buttonLeft' | 'buttonRight';
/**
 * Horizontal scrollable component with arrows to navigate
 *
 * @public
 *
 */
export declare function HorizontalScrollGrid(props: PropsWithChildren<Props>): JSX.Element;
export {};
