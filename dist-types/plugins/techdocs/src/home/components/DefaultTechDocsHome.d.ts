/// <reference types="react" />
import { TableColumn, TableProps } from '@backstage/core-components';
import { UserListFilterKind } from '@backstage/plugin-catalog-react';
import { DocsTableRow } from './Tables';
/**
 * Props for {@link DefaultTechDocsHome}
 *
 * @public
 */
export declare type DefaultTechDocsHomeProps = {
    initialFilter?: UserListFilterKind;
    columns?: TableColumn<DocsTableRow>[];
    actions?: TableProps<DocsTableRow>['actions'];
};
/**
 * Component which renders a default documentation landing page.
 *
 * @public
 */
export declare const DefaultTechDocsHome: (props: DefaultTechDocsHomeProps) => JSX.Element;
