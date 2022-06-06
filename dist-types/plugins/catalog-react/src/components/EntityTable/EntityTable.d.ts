import { Entity } from '@backstage/catalog-model';
import { ReactNode } from 'react';
import { InfoCardVariants, TableColumn } from '@backstage/core-components';
/**
 * Props for {@link EntityTable}.
 *
 * @public
 */
export interface EntityTableProps<T extends Entity> {
    title: string;
    variant?: InfoCardVariants;
    entities: T[];
    emptyContent?: ReactNode;
    columns: TableColumn<T>[];
}
/**
 * A general entity table component, that can be used for composing more
 * specific entity tables.
 *
 * @public
 */
export declare const EntityTable: {
    <T extends Entity>(props: EntityTableProps<T>): JSX.Element;
    columns: Readonly<{
        createEntityRefColumn<T_1 extends Entity>(options: {
            defaultKind?: string | undefined;
        }): TableColumn<T_1>;
        createEntityRelationColumn<T_2 extends Entity>({ title, relation, defaultKind, filter: entityFilter, }: {
            title: string;
            relation: string;
            defaultKind?: string | undefined;
            filter?: {
                kind: string;
            } | undefined;
        }): TableColumn<T_2>;
        createOwnerColumn<T_3 extends Entity>(): TableColumn<T_3>;
        createDomainColumn<T_4 extends Entity>(): TableColumn<T_4>;
        createSystemColumn<T_5 extends Entity>(): TableColumn<T_5>;
        createMetadataDescriptionColumn<T_6 extends Entity>(): TableColumn<T_6>;
        createSpecLifecycleColumn<T_7 extends Entity>(): TableColumn<T_7>;
        createSpecTypeColumn<T_8 extends Entity>(): TableColumn<T_8>;
    }>;
    systemEntityColumns: TableColumn<import("@backstage/catalog-model").SystemEntity>[];
    componentEntityColumns: TableColumn<import("@backstage/catalog-model").ComponentEntity>[];
};
