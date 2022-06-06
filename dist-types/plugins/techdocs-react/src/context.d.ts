import React, { Dispatch, SetStateAction, ReactNode } from 'react';
import { AsyncState } from 'react-use/lib/useAsync';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { TechDocsEntityMetadata, TechDocsMetadata } from './types';
/**
 * @public type for the value of the TechDocsReaderPageContext
 */
export declare type TechDocsReaderPageValue = {
    metadata: AsyncState<TechDocsMetadata>;
    entityRef: CompoundEntityRef;
    entityMetadata: AsyncState<TechDocsEntityMetadata>;
    shadowRoot?: ShadowRoot;
    setShadowRoot: Dispatch<SetStateAction<ShadowRoot | undefined>>;
    title: string;
    setTitle: Dispatch<SetStateAction<string>>;
    subtitle: string;
    setSubtitle: Dispatch<SetStateAction<string>>;
    /**
     * @deprecated property can be passed down directly to the `TechDocsReaderPageContent` instead.
     */
    onReady?: () => void;
};
/**
 * render function for {@link TechDocsReaderPageProvider}
 *
 * @public
 */
export declare type TechDocsReaderPageProviderRenderFunction = (value: TechDocsReaderPageValue) => JSX.Element;
/**
 * Props for {@link TechDocsReaderPageProvider}
 *
 * @public
 */
export declare type TechDocsReaderPageProviderProps = {
    entityRef: CompoundEntityRef;
    children: TechDocsReaderPageProviderRenderFunction | ReactNode;
};
/**
 * A context to store the reader page state
 * @public
 */
export declare const TechDocsReaderPageProvider: React.MemoExoticComponent<({ entityRef, children }: TechDocsReaderPageProviderProps) => JSX.Element>;
/**
 * Hook used to get access to shared state between reader page components.
 * @public
 */
export declare const useTechDocsReaderPage: () => TechDocsReaderPageValue;
