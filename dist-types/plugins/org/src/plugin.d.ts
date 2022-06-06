/// <reference types="react" />
/** @public */
export declare const orgPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{}, {
    catalogIndex: import("@backstage/core-plugin-api").ExternalRouteRef<undefined, false>;
}>;
/** @public */
export declare const EntityGroupProfileCard: (props: {
    variant?: import("@backstage/core-components").InfoCardVariants | undefined;
}) => JSX.Element;
/** @public */
export declare const EntityMembersListCard: (props: {
    memberDisplayTitle?: string | undefined;
    pageSize?: number | undefined;
}) => JSX.Element;
/** @public */
export declare const EntityOwnershipCard: (props: {
    variant?: import("@backstage/core-components").InfoCardVariants | undefined;
    entityFilterKind?: string[] | undefined;
    hideRelationsToggle?: boolean | undefined;
    relationsType?: string | undefined;
}) => JSX.Element;
/** @public */
export declare const EntityUserProfileCard: (props: {
    variant?: import("@backstage/core-components").InfoCardVariants | undefined;
}) => JSX.Element;
