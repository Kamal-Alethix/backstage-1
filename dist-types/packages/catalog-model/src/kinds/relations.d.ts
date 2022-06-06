/**
 * An ownership relation where the owner is usually an organizational
 * entity (user or group), and the other entity can be anything. Reversed
 * direction of {@link RELATION_OWNER_OF}.
 *
 * @public
 */
export declare const RELATION_OWNED_BY = "ownedBy";
/**
 * A relationship from an owner to the owned entity. Reversed direction of
 * {@link RELATION_OWNED_BY}.
 *
 * @public
 */
export declare const RELATION_OWNER_OF = "ownerOf";
/**
 * A relation with an API entity, typically from a component. Reversed direction of
 * {@link RELATION_API_CONSUMED_BY}.
 *
 * @public
 */
export declare const RELATION_CONSUMES_API = "consumesApi";
/**
 * A relation of an API being consumed, typically by a component. Reversed direction of
 * {@link RELATION_CONSUMES_API}.
 *
 * @public
 */
export declare const RELATION_API_CONSUMED_BY = "apiConsumedBy";
/**
 * A relation from an API provider entity (typically a component) to the API. Reversed direction of
 * {@link RELATION_API_PROVIDED_BY}.
 *
 * @public
 */
export declare const RELATION_PROVIDES_API = "providesApi";
/**
 * A relation from an API to its provider entity (typically a component). Reversed direction of
 * {@link RELATION_PROVIDES_API}.
 *
 * @public
 */
export declare const RELATION_API_PROVIDED_BY = "apiProvidedBy";
/**
 * A relation denoting a dependency on another entity. Reversed direction of
 * {@link RELATION_DEPENDENCY_OF}.
 *
 * @public
 */
export declare const RELATION_DEPENDS_ON = "dependsOn";
/**
 * A relation denoting a reverse dependency by another entity. Reversed direction of
 * {@link RELATION_DEPENDS_ON}.
 *
 * @public
 */
export declare const RELATION_DEPENDENCY_OF = "dependencyOf";
/**
 * A parent/child relation to build up a tree, used for example to describe
 * the organizational structure between groups. Reversed direction of
 * {@link RELATION_CHILD_OF}.
 *
 * @public
 */
export declare const RELATION_PARENT_OF = "parentOf";
/**
 * A relation from a child to a parent entity, used for example to describe
 * the organizational structure between groups. Reversed direction of
 * {@link RELATION_PARENT_OF}.
 *
 * @public
 */
export declare const RELATION_CHILD_OF = "childOf";
/**
 * A membership relation, typically for users in a group. Reversed direction of
 * {@link RELATION_HAS_MEMBER}.
 *
 * @public
 */
export declare const RELATION_MEMBER_OF = "memberOf";
/**
 * A relation from a group to its member, typcally a user in a group. Reversed direction of
 * {@link RELATION_MEMBER_OF}.
 *
 * @public
 */
export declare const RELATION_HAS_MEMBER = "hasMember";
/**
 * A part/whole relation, typically for components in a system and systems
 * in a domain. Reversed direction of {@link RELATION_HAS_PART}.
 *
 * @public
 */
export declare const RELATION_PART_OF = "partOf";
/**
 * A relation from a containing entity to a contained entity. Reversed direction of
 * {@link RELATION_PART_OF}.
 *
 * @public
 */
export declare const RELATION_HAS_PART = "hasPart";
