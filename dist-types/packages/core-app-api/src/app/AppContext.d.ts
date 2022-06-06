import { PropsWithChildren } from 'react';
import { AppContext as AppContextV1 } from './types';
declare type Props = {
    appContext: AppContextV1;
};
export declare const AppContextProvider: ({ appContext, children, }: PropsWithChildren<Props>) => JSX.Element;
export {};
