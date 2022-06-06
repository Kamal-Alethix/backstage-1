/**
 * The envelope skeleton parts of an entity - whatever is necessary to be able
 * to give it a ref and pass to further validation / policy checking.
 *
 * @public
 * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/
 */
export declare type EntityEnvelope = {
    /**
     * The version of specification format for this particular entity that
     * this is written against.
     */
    apiVersion: string;
    /**
     * The high level entity type being described.
     */
    kind: string;
    /**
     * Metadata related to the entity.
     */
    metadata: {
        /**
         * The name of the entity.
         *
         * Must be unique within the catalog at any given point in time, for any
         * given namespace + kind pair.
         */
        name: string;
        /**
         * The namespace that the entity belongs to.
         */
        namespace?: string;
    };
};
