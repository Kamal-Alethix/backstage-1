/// <reference types="react" />
import { TableColumn, TableProps } from '@backstage/core-components';
import { CatalogTableRow } from '@backstage/plugin-catalog';
import { UserListFilterKind } from '@backstage/plugin-catalog-react';
/**
 * DefaultApiExplorerPageProps
 * @public
 */
export declare type DefaultApiExplorerPageProps = {
    initiallySelectedFilter?: UserListFilterKind;
    columns?: TableColumn<CatalogTableRow>[];
    actions?: TableProps<CatalogTableRow>['actions'];
};
/**
 * DefaultApiExplorerPage
 * @public
 */
export declare const DefaultApiExplorerPage: ({ initiallySelectedFilter, columns, actions, }: DefaultApiExplorerPageProps) => JSX.Element;
