import React from 'react';
import { Maybe, Product } from '../../types';
declare type CostInsightsNavigationProps = {
    alerts: number;
    products: Maybe<Product[]>;
};
export declare const CostInsightsNavigation: React.MemoExoticComponent<({ alerts, products }: CostInsightsNavigationProps) => JSX.Element>;
export {};
