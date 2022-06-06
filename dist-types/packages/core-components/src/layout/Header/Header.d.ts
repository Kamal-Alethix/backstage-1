import { CSSProperties, PropsWithChildren, ReactNode } from 'react';
/** @public */
export declare type HeaderClassKey = 'header' | 'leftItemsBox' | 'rightItemsBox' | 'title' | 'subtitle' | 'type' | 'breadcrumb' | 'breadcrumbType' | 'breadcrumbTitle';
declare type Props = {
    component?: ReactNode;
    pageTitleOverride?: string;
    style?: CSSProperties;
    subtitle?: ReactNode;
    title: ReactNode;
    tooltip?: string;
    type?: string;
    typeLink?: string;
};
/**
 * Backstage main header with abstract color background in multiple variants
 *
 * @public
 *
 */
export declare function Header(props: PropsWithChildren<Props>): JSX.Element;
export {};
