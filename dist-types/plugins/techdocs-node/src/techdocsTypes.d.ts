import { IndexableDocument } from '@backstage/plugin-search-common';
/**
 * TechDocs indexable document interface
 * @public
 */
export interface TechDocsDocument extends IndexableDocument {
    /**
     * Entity kind
     */
    kind: string;
    /**
     * Entity metadata namespace
     */
    namespace: string;
    /**
     * Entity metadata name
     */
    name: string;
    /**
     * Entity lifecycle
     */
    lifecycle: string;
    /**
     * Entity owner
     */
    owner: string;
    /**
     * Entity path
     */
    path: string;
}
