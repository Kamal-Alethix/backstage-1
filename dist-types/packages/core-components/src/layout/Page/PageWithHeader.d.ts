import { PropsWithChildren, ComponentProps } from 'react';
import { Header } from '../Header';
declare type PageWithHeaderProps = ComponentProps<typeof Header> & {
    themeId: string;
};
export declare function PageWithHeader(props: PropsWithChildren<PageWithHeaderProps>): JSX.Element;
export {};
