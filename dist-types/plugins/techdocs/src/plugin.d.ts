/// <reference types="react" />
/**
 * The Backstage plugin that renders technical documentation for your components
 *
 * @public
 */
export declare const techdocsPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    root: import("@backstage/core-plugin-api").RouteRef<undefined>;
    docRoot: import("@backstage/core-plugin-api").RouteRef<{
        name: string;
        kind: string;
        namespace: string;
    }>;
    entityContent: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {}>;
/**
 * Routable extension used to render docs
 *
 * @public
 */
export declare const TechdocsPage: () => JSX.Element;
/**
 * Routable extension used to render docs on Entity page
 *
 * @public
 */
export declare const EntityTechdocsContent: (props: {
    children?: import("react").ReactNode;
}) => JSX.Element | null;
/**
 * Component which takes a custom tabs config object and renders a documentation landing page.
 *
 * @public
 */
export declare const TechDocsCustomHome: (props: import("./home/components/TechDocsCustomHome").TechDocsCustomHomeProps) => JSX.Element;
/**
 * Responsible for rendering the provided router element
 *
 * @public
 */
export declare const TechDocsIndexPage: () => JSX.Element;
/**
 * Component responsible for composing a TechDocs reader page experience
 *
 * @public
 */
export declare const TechDocsReaderPage: (props: import("./reader/components/TechDocsReaderPage").TechDocsReaderPageProps) => JSX.Element;
