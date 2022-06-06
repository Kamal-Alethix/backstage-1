import { PropsWithChildren } from 'react';
/** @public */
export declare type BackstageContentClassKey = 'root' | 'stretch' | 'noPadding';
declare type Props = {
    stretch?: boolean;
    noPadding?: boolean;
    className?: string;
};
/**
 * The main content part inside a {@link Page}.
 *
 * @public
 *
 */
export declare function Content(props: PropsWithChildren<Props>): JSX.Element;
export {};
