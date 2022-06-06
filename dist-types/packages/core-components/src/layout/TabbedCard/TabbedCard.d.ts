import { TabProps } from '@material-ui/core/Tab';
import React, { PropsWithChildren, ReactElement, ReactNode } from 'react';
import { BottomLinkProps } from '../BottomLink';
import { ErrorBoundaryProps } from '../ErrorBoundary';
export declare type TabbedCardClassKey = 'root' | 'indicator';
/** @public */
export declare type BoldHeaderClassKey = 'root' | 'title' | 'subheader';
declare type Props = {
    /** @deprecated Use errorBoundaryProps instead */
    slackChannel?: string;
    errorBoundaryProps?: ErrorBoundaryProps;
    children?: ReactElement<TabProps>[];
    onChange?: (event: React.ChangeEvent<{}>, value: number | string) => void;
    title?: string;
    value?: number | string;
    deepLink?: BottomLinkProps;
};
export declare function TabbedCard(props: PropsWithChildren<Props>): JSX.Element;
/** @public */
export declare type CardTabClassKey = 'root' | 'selected';
declare type CardTabProps = TabProps & {
    children: ReactNode;
};
/**
 * Card tab component used in {@link TabbedCard}
 *
 * @public
 *
 */
export declare function CardTab(props: PropsWithChildren<CardTabProps>): JSX.Element;
export {};
