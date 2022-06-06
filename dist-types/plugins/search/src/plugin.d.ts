/// <reference types="react" />
export declare const rootRouteRef: import("@backstage/core-plugin-api").RouteRef<undefined>;
export declare const rootNextRouteRef: import("@backstage/core-plugin-api").RouteRef<undefined>;
export declare const searchPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    root: import("@backstage/core-plugin-api").RouteRef<undefined>;
    nextRoot: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {}>;
export declare const SearchPage: () => JSX.Element;
/**
 * @deprecated This component was used for rapid prototyping of the Backstage
 * Search platform. Now that the API has stabilized, you should use the
 * <SearchPage /> component instead. This component will be removed in an
 * upcoming release.
 */
export declare const SearchPageNext: () => JSX.Element;
export declare const SearchBar: ({ onChange, ...props }: Partial<import("./components/SearchBar").SearchBarBaseProps>) => JSX.Element;
/**
 * @deprecated This component was used for rapid prototyping of the Backstage
 * Search platform. Now that the API has stabilized, you should use the
 * <SearchBar /> component instead. This component will be removed in an
 * upcoming release.
 */
export declare const SearchBarNext: ({ onChange, ...props }: Partial<import("./components/SearchBar").SearchBarBaseProps>) => JSX.Element;
export declare const SearchResult: ({ children }: {
    children: (results: {
        results: import("@backstage/plugin-search-common").SearchResult[];
    }) => JSX.Element;
}) => JSX.Element;
/**
 * @deprecated This component was used for rapid prototyping of the Backstage
 * Search platform. Now that the API has stabilized, you should use the
 * <SearchResult /> component instead. This component will be removed in an
 * upcoming release.
 */
export declare const SearchResultNext: ({ children }: {
    children: (results: {
        results: import("@backstage/plugin-search-common").SearchResult[];
    }) => JSX.Element;
}) => JSX.Element;
export declare const SidebarSearchModal: (props: import("./components/SidebarSearchModal").SidebarSearchModalProps) => JSX.Element;
export declare const DefaultResultListItem: ({ result, highlight, icon, secondaryAction, lineClamp, }: {
    icon?: import("react").ReactNode;
    secondaryAction?: import("react").ReactNode;
    result: import("@backstage/plugin-search-common").SearchDocument;
    highlight?: import("@backstage/plugin-search-common").ResultHighlight | undefined;
    lineClamp?: number | undefined;
}) => JSX.Element;
export declare const HomePageSearchBar: ({ ...props }: Partial<Omit<import("./components/SearchBar").SearchBarBaseProps, "onChange" | "onSubmit">>) => JSX.Element;
