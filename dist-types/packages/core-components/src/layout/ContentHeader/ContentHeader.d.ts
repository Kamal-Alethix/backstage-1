import { PropsWithChildren, ReactNode } from 'react';
/** @public */
export declare type ContentHeaderClassKey = 'container' | 'leftItemsBox' | 'rightItemsBox' | 'description' | 'title';
declare type ContentHeaderTitleProps = {
    title?: string;
    className?: string;
};
declare type ContentHeaderProps = {
    title?: ContentHeaderTitleProps['title'];
    titleComponent?: ReactNode;
    description?: string;
    textAlign?: 'left' | 'right' | 'center';
};
/**
 *  A header at the top inside a {@link Content}.
 *
 * @public
 *
 */
export declare function ContentHeader(props: PropsWithChildren<ContentHeaderProps>): JSX.Element;
export {};
