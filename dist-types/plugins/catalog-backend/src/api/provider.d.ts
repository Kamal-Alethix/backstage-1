import { DeferredEntity } from '../processing';
/**
 * @public
 * A 'full' mutation replaces all existing entities created by this entity provider with new ones.
 * A 'delta' mutation can both add and remove entities provided by this provider. Previously provided
 * entities from a 'full' mutation are not removed.
 */
export declare type EntityProviderMutation = {
    type: 'full';
    entities: DeferredEntity[];
} | {
    type: 'delta';
    added: DeferredEntity[];
    removed: DeferredEntity[];
};
/**
 * The EntityProviderConnection is the connection between the catalog and the entity provider.
 * The EntityProvider use this connection to add and remove entities from the catalog.
 * @public
 */
export interface EntityProviderConnection {
    /**
     * Applies either a full or delta update to the catalog engine.
     */
    applyMutation(mutation: EntityProviderMutation): Promise<void>;
}
/**
 * An EntityProvider is able to provide entities to the catalog.
 * See https://backstage.io/docs/features/software-catalog/life-of-an-entity for more details.
 * @public
 */
export interface EntityProvider {
    /** Unique provider name used internally for caching. */
    getProviderName(): string;
    /** Connect is called upon initialization by the catalog engine. */
    connect(connection: EntityProviderConnection): Promise<void>;
}
