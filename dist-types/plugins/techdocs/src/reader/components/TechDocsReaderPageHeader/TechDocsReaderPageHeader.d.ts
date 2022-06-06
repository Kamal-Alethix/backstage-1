import { PropsWithChildren } from 'react';
import { TechDocsEntityMetadata, TechDocsMetadata } from '@backstage/plugin-techdocs-react';
import { CompoundEntityRef } from '@backstage/catalog-model';
/**
 * Props for {@link TechDocsReaderPageHeader}
 *
 * @public
 * @deprecated No need to pass down properties anymore. The component consumes data from `TechDocsReaderPageContext` instead. Use the {@link @backstage/plugin-techdocs-react#useTechDocsReaderPage} hook for custom header.
 */
export declare type TechDocsReaderPageHeaderProps = PropsWithChildren<{
    entityRef?: CompoundEntityRef;
    entityMetadata?: TechDocsEntityMetadata;
    techDocsMetadata?: TechDocsMetadata;
}>;
/**
 * Renders the reader page header.
 * This component does not accept props, please use
 * the Tech Docs add-ons to customize it
 * @public
 */
export declare const TechDocsReaderPageHeader: (props: TechDocsReaderPageHeaderProps) => JSX.Element | null;
