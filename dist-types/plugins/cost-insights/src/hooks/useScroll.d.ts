import React, { Dispatch, SetStateAction, PropsWithChildren } from 'react';
import { Maybe } from '../types';
export declare type ScrollTo = Maybe<string>;
export declare type ScrollContextProps = {
    scroll: ScrollTo;
    setScroll: Dispatch<SetStateAction<ScrollTo>>;
};
export declare const ScrollContext: React.Context<ScrollContextProps | undefined>;
export declare const ScrollProvider: ({ children }: PropsWithChildren<{}>) => JSX.Element;
export declare enum ScrollType {
    AlertSummary = "alert-status-summary"
}
export declare function useScroll(): readonly [ScrollTo, React.Dispatch<React.SetStateAction<ScrollTo>>];
