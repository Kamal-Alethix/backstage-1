import { TableColumn } from '@backstage/core-components';
import { DocsTableRow } from './types';
/**
 * Not directly exported, but through DocsTable.columns and EntityListDocsTable.columns
 *
 * @public
 */
export declare const columnFactories: {
    createNameColumn(): TableColumn<DocsTableRow>;
    createOwnerColumn(): TableColumn<DocsTableRow>;
    createTypeColumn(): TableColumn<DocsTableRow>;
};
