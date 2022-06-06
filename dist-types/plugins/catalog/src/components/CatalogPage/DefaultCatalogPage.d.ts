/// <reference types="react" />
import { TableColumn, TableProps } from '@backstage/core-components';
import { UserListFilterKind } from '@backstage/plugin-catalog-react';
import { CatalogTableRow } from '../CatalogTable';
/**
 * Props for root catalog pages.
 *
 * @public
 */
export interface DefaultCatalogPageProps {
    initiallySelectedFilter?: UserListFilterKind;
    columns?: TableColumn<CatalogTableRow>[];
    actions?: TableProps<CatalogTableRow>['actions'];
    initialKind?: string;
    tableOptions?: TableProps<CatalogTableRow>['options'];
}
export declare function DefaultCatalogPage(props: DefaultCatalogPageProps): JSX.Element;
