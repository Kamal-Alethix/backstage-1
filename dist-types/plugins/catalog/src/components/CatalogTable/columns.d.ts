import { CatalogTableRow } from './types';
import { TableColumn } from '@backstage/core-components';
/** @public */
export declare const columnFactories: Readonly<{
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
