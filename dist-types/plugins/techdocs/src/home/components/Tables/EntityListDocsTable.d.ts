/// <reference types="react" />
import { TableColumn, TableProps } from '@backstage/core-components';
import { DocsTableRow } from './types';
/**
 * Props for {@link EntityListDocsTable}.
 *
 * @public
 */
export declare type EntityListDocsTableProps = {
    columns?: TableColumn<DocsTableRow>[];
    actions?: TableProps<DocsTableRow>['actions'];
};
/**
 * Component which renders a table with entities from catalog.
 *
 * @public
 */
export declare const EntityListDocsTable: {
    (props: EntityListDocsTableProps): JSX.Element;
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
