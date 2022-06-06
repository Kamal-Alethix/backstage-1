/// <reference types="react" />
import { CompoundEntityRef } from '@backstage/catalog-model';
import { TechDocsEntityMetadata, TechDocsMetadata } from '@backstage/plugin-techdocs-react';
/**
 * Helper function that gives the children of {@link TechDocsReaderPage} access to techdocs and entity metadata
 *
 * @public
 */
export declare type TechDocsReaderPageRenderFunction = ({ techdocsMetadataValue, entityMetadataValue, entityRef, }: {
    techdocsMetadataValue?: TechDocsMetadata | undefined;
    entityMetadataValue?: TechDocsEntityMetadata | undefined;
    entityRef: CompoundEntityRef;
    /**
     * @deprecated You can continue pass this property, but directly to the `TechDocsReaderPageContent` component.
     */
    onReady?: () => void;
}) => JSX.Element;
