import { ReactNode } from 'react';
declare class ScrollTargetsForwarder {
    private readonly listeners;
    setScrollListener(id: string, listener: () => void): () => void;
    scrollTo(id: string): void;
}
export declare function ScrollTargetsProvider({ children }: {
    children: ReactNode;
}): JSX.Element;
export declare function useScrollTargets(): ScrollTargetsForwarder | undefined;
export {};
