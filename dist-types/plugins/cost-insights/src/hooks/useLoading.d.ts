import React, { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import { Loading } from '../types';
export declare type LoadingContextProps = {
    state: Loading;
    dispatch: Dispatch<Partial<SetStateAction<Loading>>>;
    actions: Array<string>;
};
export declare type MapLoadingToProps<T> = (props: LoadingContextProps) => T;
export declare const LoadingContext: React.Context<LoadingContextProps | undefined>;
export declare const LoadingProvider: ({ children }: PropsWithChildren<{}>) => JSX.Element;
export declare function useLoading<T>(mapLoadingToProps: MapLoadingToProps<T>): T;
