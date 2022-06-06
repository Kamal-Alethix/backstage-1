import React, { PropsWithChildren } from 'react';
export declare type BillingDateContextProps = {
    lastCompleteBillingDate: string;
};
export declare const BillingDateContext: React.Context<BillingDateContextProps | undefined>;
export declare const dateRegex: RegExp;
export declare const BillingDateProvider: ({ children }: PropsWithChildren<{}>) => JSX.Element | null;
export declare function useLastCompleteBillingDate(): string;
