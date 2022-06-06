/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
import { TableColumn, TableProps } from '@backstage/core-components';
import { DocsTableRow } from './types';
/**
 * Props for {@link DocsTable}.
 *
 * @public
 */
export declare type DocsTableProps = {
    entities: Entity[] | undefined;
    title?: string | undefined;
    loading?: boolean | undefined;
    columns?: TableColumn<DocsTableRow>[];
    actions?: TableProps<DocsTableRow>['actions'];
};
/**
 * Component which renders a table documents
 *
 * @public
 */
export declare const DocsTable: {
    (props: DocsTableProps): JSX.Element | null;
    columns: {
        createNameColumn(): TableColumn<DocsTableRow>;
        createOwnerColumn(): TableColumn<DocsTableRow>;
        createTypeColumn(): TableColumn<DocsTableRow>;
    };
    actions: {
        createCopyDocsUrlAction(copyToClipboard: Function): (row: DocsTableRow) => {
            icon: () => JSX.Element;
            tooltip: string;
            onClick: () => any;
        };
        createStarEntityAction(isStarredEntity: Function, toggleStarredEntity: Function): ({ entity }: DocsTableRow) => {
            cellStyle: {
                paddingLeft: string;
            };
            icon: () => JSX.Element;
            tooltip: string;
            onClick: () => any;
        };
    };
};
