/// <reference types="react" />
import { CompoundEntityRef } from '@backstage/catalog-model';
/**
 * Props for {@link TechDocsSearch}
 *
 * @public
 */
export declare type TechDocsSearchProps = {
    entityId: CompoundEntityRef;
    debounceTime?: number;
};
/**
 * Component used to render search bar on TechDocs page, scoped to
 *
 * @public
 */
export declare const TechDocsSearch: (props: TechDocsSearchProps) => JSX.Element;
