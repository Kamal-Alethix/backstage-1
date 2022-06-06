/// <reference types="react" />
/**
 * The main plugin export for the scaffolder.
 * @public
 */
export declare const scaffolderPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    root: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {
    registerComponent: import("@backstage/core-plugin-api").ExternalRouteRef<undefined, true>;
}>;
/**
 * A field extension for selecting an Entity that exists in the Catalog.
 *
 * @public
 */
export declare const EntityPickerFieldExtension: import("./extensions").FieldExtensionComponent<string, import("./components/fields/EntityPicker/EntityPicker").EntityPickerUiOptions>;
/**
 * The field extension for selecting a name for a new Entity in the Catalog.
 *
 * @public
 */
export declare const EntityNamePickerFieldExtension: import("./extensions").FieldExtensionComponent<string, {}>;
/**
 * The field extension which provides the ability to select a RepositoryUrl.
 * Currently this is an encoded URL that looks something like the following `github.com?repo=myRepoName&owner=backstage`.
 *
 * @public
 */
export declare const RepoUrlPickerFieldExtension: import("./extensions").FieldExtensionComponent<string, import("./components/fields/RepoUrlPicker").RepoUrlPickerUiOptions>;
/**
 * A field extension for picking users and groups out of the Catalog.
 *
 * @public
 */
export declare const OwnerPickerFieldExtension: import("./extensions").FieldExtensionComponent<string, import("./components/fields/OwnerPicker/OwnerPicker").OwnerPickerUiOptions>;
/**
 * The Router and main entrypoint to the Scaffolder plugin.
 *
 * @public
 */
export declare const ScaffolderPage: (props: import("./components/Router").RouterProps) => JSX.Element;
/**
 * A field extension to show all the Entities that are owned by the current logged-in User for use in templates.
 *
 * @public
 */
export declare const OwnedEntityPickerFieldExtension: import("./extensions").FieldExtensionComponent<string, import("./components/fields/OwnedEntityPicker/OwnedEntityPicker").OwnedEntityPickerUiOptions>;
/**
 * EntityTagsPickerFieldExtension
 * @public
 */
export declare const EntityTagsPickerFieldExtension: import("./extensions").FieldExtensionComponent<string[], import("./components/fields/EntityTagsPicker/EntityTagsPicker").EntityTagsPickerUiOptions>;
/**
 * @alpha
 * The Router and main entrypoint to the Alpha Scaffolder plugin.
 */
export declare const NextScaffolderPage: (props: import("react").PropsWithChildren<import("./next/Router").NextRouterProps>) => JSX.Element;
