import React, { PropsWithChildren } from 'react';
import { Currency, Icon, Metric, Product } from '../types';
export declare type ConfigContextProps = {
    metrics: Metric[];
    products: Product[];
    icons: Icon[];
    engineerCost: number;
    currencies: Currency[];
};
export declare const ConfigContext: React.Context<ConfigContextProps | undefined>;
export declare const ConfigProvider: ({ children }: PropsWithChildren<{}>) => JSX.Element | null;
export declare function useConfig(): ConfigContextProps;
