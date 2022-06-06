import React, { ComponentType, ReactNode } from 'react';
import { ReaderState } from './useReaderState';
export declare const useTechDocsReader: () => ReaderState;
/**
 * @public Render function for {@link TechDocsReaderProvider}
 */
export declare type TechDocsReaderProviderRenderFunction = (value: ReaderState) => JSX.Element;
/**
 * @public Props for {@link TechDocsReaderProvider}
 */
export declare type TechDocsReaderProviderProps = {
    children: TechDocsReaderProviderRenderFunction | ReactNode;
};
/**
 * Provides shared building process state to the reader page components.
 *
 * @public
 */
export declare const TechDocsReaderProvider: ({ children, }: TechDocsReaderProviderProps) => JSX.Element;
export declare const withTechDocsReaderProvider: <T extends {}>(Component: React.ComponentType<T>) => (props: T) => JSX.Element;
