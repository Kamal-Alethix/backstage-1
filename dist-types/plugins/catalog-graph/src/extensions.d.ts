/// <reference types="react" />
/**
 * A card that displays the directly related entities to the current entity.
 *
 * @public
 */
export declare const EntityCatalogGraphCard: (props: {
    variant?: import("@backstage/core-components").InfoCardVariants | undefined;
    relationPairs?: import("./components").RelationPairs | undefined;
    maxDepth?: number | undefined;
    unidirectional?: boolean | undefined;
    mergeRelations?: boolean | undefined;
    kinds?: string[] | undefined;
    relations?: string[] | undefined;
    direction?: import("./components").Direction | undefined;
    height?: number | undefined;
    title?: string | undefined;
    zoom?: "disabled" | "enabled" | "enable-on-click" | undefined;
}) => JSX.Element;
/**
 * A standalone page that can be added to your application providing a viewer
 * for your entities and their relations.
 *
 * @public
 */
export declare const CatalogGraphPage: (props: {
    relationPairs?: import("./components").RelationPairs | undefined;
    initialState?: {
        selectedRelations?: string[] | undefined;
        selectedKinds?: string[] | undefined;
        rootEntityRefs?: string[] | undefined;
        maxDepth?: number | undefined;
        unidirectional?: boolean | undefined;
        mergeRelations?: boolean | undefined;
        direction?: import("./components").Direction | undefined;
        showFilters?: boolean | undefined;
    } | undefined;
}) => JSX.Element;
