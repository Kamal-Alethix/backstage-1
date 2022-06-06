import React, { Dispatch, SetStateAction, PropsWithChildren } from 'react';
import { Currency } from '../types';
export declare type CurrencyContextProps = {
    currency: Currency;
    setCurrency: Dispatch<SetStateAction<Currency>>;
};
export declare const CurrencyContext: React.Context<CurrencyContextProps | undefined>;
export declare const CurrencyProvider: ({ children }: PropsWithChildren<{}>) => JSX.Element;
export declare function useCurrency(): [Currency, Dispatch<SetStateAction<Currency>>];
