import { CompoundEntityRef } from '@backstage/catalog-model';
/**
 * Holds the entity location information.
 *
 * @remarks
 *
 *  `presence` flag: when using repo importer plugin, location is being created before the component yaml file is merged to the main branch.
 *  This flag is then set to indicate that the file can be not present.
 *  default value: 'required'.
 *
 * @public
 */
export declare type LocationSpec = {
    type: string;
    target: string;
    presence?: 'optional' | 'required';
};
/**
 * Holds the relation data for entities.
 *
 * @public
 */
export declare type EntityRelationSpec = {
    /**
     * The source entity of this relation.
     */
    source: CompoundEntityRef;
    /**
     * The type of the relation.
     */
    type: string;
    /**
     * The target entity of this relation.
     */
    target: CompoundEntityRef;
};
