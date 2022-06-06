import { Entity } from '@backstage/catalog-model';
import { TableColumn } from '@backstage/core-components';
/** @public */
export declare const columnFactories: Readonly<{
    createEntityRefColumn<T extends Entity>(options: {
        defaultKind?: string;
    }): TableColumn<T>;
    createEntityRelationColumn<T_1 extends Entity>({ title, relation, defaultKind, filter: entityFilter, }: {
        title: string;
        relation: string;
        defaultKind?: string | undefined;
        filter?: {
            kind: string;
        } | undefined;
    }): TableColumn<T_1>;
    createOwnerColumn<T_2 extends Entity>(): TableColumn<T_2>;
    createDomainColumn<T_3 extends Entity>(): TableColumn<T_3>;
    createSystemColumn<T_4 extends Entity>(): TableColumn<T_4>;
    createMetadataDescriptionColumn<T_5 extends Entity>(): TableColumn<T_5>;
    createSpecLifecycleColumn<T_6 extends Entity>(): TableColumn<T_6>;
    createSpecTypeColumn<T_7 extends Entity>(): TableColumn<T_7>;
}>;
