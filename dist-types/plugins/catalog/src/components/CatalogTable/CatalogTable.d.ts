/// <reference types="react" />
import { CatalogTableRow } from './types';
import { TableColumn, TableProps } from '@backstage/core-components';
/**
 * Props for {@link CatalogTable}.
 *
 * @public
 */
export interface CatalogTableProps {
    columns?: TableColumn<CatalogTableRow>[];
    actions?: TableProps<CatalogTableRow>['actions'];
    tableOptions?: TableProps<CatalogTableRow>['options'];
}
/** @public */
export declare const CatalogTable: {
    (props: CatalogTableProps): JSX.Element;
    columns: Readonly<{
        createNameColumn(options?: {
            defaultKind?: string | undefined;
        } | undefined): TableColumn<CatalogTableRow>;
        createSystemColumn(): TableColumn<CatalogTableRow>;
        createOwnerColumn(): TableColumn<CatalogTableRow>;
        createSpecTypeColumn(): TableColumn<CatalogTableRow>;
        createSpecLifecycleColumn(): TableColumn<CatalogTableRow>;
        createMetadataDescriptionColumn(): TableColumn<CatalogTableRow>;
        createTagsColumn(): TableColumn<CatalogTableRow>;
    }>;
};
