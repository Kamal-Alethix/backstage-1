import { ReactNode } from 'react';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { TechDocsReaderPageRenderFunction } from '../../../types';
/**
 * Props for {@link TechDocsReaderLayout}
 * @public
 */
export declare type TechDocsReaderLayoutProps = {
    /**
     * Show or hide the header, defaults to true.
     */
    withHeader?: boolean;
    /**
     * Show or hide the content search bar, defaults to true.
     */
    withSearch?: boolean;
};
/**
 * Default TechDocs reader page structure composed with a header and content
 * @public
 */
export declare const TechDocsReaderLayout: ({ withSearch, withHeader, }: TechDocsReaderLayoutProps) => JSX.Element;
/**
 * @public
 */
export declare type TechDocsReaderPageProps = {
    entityRef?: CompoundEntityRef;
    children?: TechDocsReaderPageRenderFunction | ReactNode;
};
/**
 * An addon-aware implementation of the TechDocsReaderPage.
 * @public
 */
export declare const TechDocsReaderPage: (props: TechDocsReaderPageProps) => JSX.Element;
