import { PropsWithChildren } from 'react';
import { Group } from '../../types';
declare type CostInsightsLayoutProps = {
    title?: string;
    groups: Group[];
};
export declare const CostInsightsLayout: ({ groups, children, }: PropsWithChildren<CostInsightsLayoutProps>) => JSX.Element;
export {};
