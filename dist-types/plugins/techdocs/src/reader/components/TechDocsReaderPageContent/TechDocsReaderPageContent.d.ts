/// <reference types="react" />
import { CompoundEntityRef } from '@backstage/catalog-model';
/**
 * Props for {@link TechDocsReaderPageContent}
 * @public
 */
export declare type TechDocsReaderPageContentProps = {
    /**
     * @deprecated No need to pass down entityRef as property anymore. Consumes the entityName from `TechDocsReaderPageContext`. Use the {@link @backstage/plugin-techdocs-react#useTechDocsReaderPage} hook for custom reader page content.
     */
    entityRef?: CompoundEntityRef;
    /**
     * Show or hide the search bar, defaults to true.
     */
    withSearch?: boolean;
    /**
     * Callback called when the content is rendered.
     */
    onReady?: () => void;
};
/**
 * Renders the reader page content
 * @public
 */
export declare const TechDocsReaderPageContent: (props: TechDocsReaderPageContentProps) => JSX.Element;
/**
 * Props for {@link Reader}
 *
 * @public
 * @deprecated use `TechDocsReaderPageContentProps` instead.
 */
export declare type ReaderProps = TechDocsReaderPageContentProps;
/**
 * Component responsible for rendering TechDocs documentation
 * @public
 * @deprecated use `TechDocsReaderPageContent` component instead.
 */
export declare const Reader: (props: TechDocsReaderPageContentProps) => JSX.Element;
