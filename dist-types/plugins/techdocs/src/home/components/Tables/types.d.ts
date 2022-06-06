import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
/**
 * Generic representing the metadata structure for a docs table row.
 *
 * @public
 */
export declare type DocsTableRow = {
    entity: Entity;
    resolved: {
        docsUrl: string;
        ownedByRelationsTitle: string;
        ownedByRelations: CompoundEntityRef[];
    };
};
