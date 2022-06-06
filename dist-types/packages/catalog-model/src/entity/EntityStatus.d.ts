import { SerializedError } from '@backstage/errors';
/**
 * The current status of the entity, as claimed by various sources.
 *
 * @alpha
 */
export declare type EntityStatus = {
    /**
     * Specific status item on a well known format.
     */
    items?: EntityStatusItem[];
};
/**
 * A specific status item on a well known format.
 * @alpha
 */
export declare type EntityStatusItem = {
    /**
     * The type of status as a unique key per source.
     */
    type: string;
    /**
     * The level / severity of the status item. If the level is "error", the
     * processing of the entity may be entirely blocked. In this case the status
     * entry may apply to a different, newer version of the data than what is
     * being returned in the catalog response.
     */
    level: EntityStatusLevel;
    /**
     * A brief message describing the status, intended for human consumption.
     */
    message: string;
    /**
     * An optional serialized error object related to the status.
     */
    error?: SerializedError;
};
/**
 * Each entity status item has a level, describing its severity.
 * @alpha
 */
export declare type EntityStatusLevel = 'info' | 'warning' | 'error';
