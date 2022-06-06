import { IndexableDocument } from '@backstage/plugin-search-common';
/**
 * The Document format for an Entity in the Catalog for search
 *
 * @public
 */
export interface CatalogEntityDocument extends IndexableDocument {
    /** @deprecated `componentType` is being renamed to `type`. During the transition both of these fields should be set to the same value, in order to avoid issues with indexing. */
    componentType: string;
    type: string;
    namespace: string;
    kind: string;
    lifecycle: string;
    owner: string;
}
