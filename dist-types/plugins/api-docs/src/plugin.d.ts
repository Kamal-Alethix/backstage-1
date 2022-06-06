/// <reference types="react" />
export declare const apiDocsPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    root: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {
    registerApi: import("@backstage/core-plugin-api").ExternalRouteRef<undefined, true>;
}>;
export declare const ApiExplorerPage: (props: import("./components/ApiExplorerPage").DefaultApiExplorerPageProps) => JSX.Element;
export declare const EntityApiDefinitionCard: () => JSX.Element;
export declare const EntityConsumedApisCard: ({ variant }: {
    variant?: import("@backstage/core-components").InfoCardVariants | undefined;
}) => JSX.Element;
export declare const EntityConsumingComponentsCard: ({ variant }: {
    variant?: import("@backstage/core-components").InfoCardVariants | undefined;
}) => JSX.Element;
export declare const EntityProvidedApisCard: ({ variant }: {
    variant?: import("@backstage/core-components").InfoCardVariants | undefined;
}) => JSX.Element;
export declare const EntityProvidingComponentsCard: ({ variant }: {
    variant?: import("@backstage/core-components").InfoCardVariants | undefined;
}) => JSX.Element;
export declare const EntityHasApisCard: ({ variant }: {
    variant?: import("@backstage/core-components").InfoCardVariants | undefined;
}) => JSX.Element;
