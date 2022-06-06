/// <reference types="react" />
import { Currency } from '../../types';
declare type CurrencySelectProps = {
    currency: Currency;
    currencies: Currency[];
    onSelect: (currency: Currency) => void;
};
export declare const CurrencySelect: ({ currency, currencies, onSelect, }: CurrencySelectProps) => JSX.Element;
export {};
