/// <reference types="react" />
import { ToolkitContentProps } from './homePageComponents';
/** @public */
export declare const homePlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    root: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {}>;
/** @public */
export declare const HomepageCompositionRoot: (props: {
    title?: string | undefined;
    children?: import("react").ReactNode;
}) => JSX.Element;
/** @public */
export declare const ComponentAccordion: (props: {
    title: string;
    expanded?: boolean | undefined;
    Content: () => JSX.Element;
    Actions?: (() => JSX.Element) | undefined;
    Settings?: (() => JSX.Element) | undefined;
    ContextProvider?: ((props: any) => JSX.Element) | undefined;
}) => JSX.Element;
/** @public */
export declare const ComponentTabs: (props: {
    title: string;
    tabs: {
        label: string;
        Component: () => JSX.Element;
    }[];
}) => JSX.Element;
/** @public */
export declare const ComponentTab: (props: {
    title: string;
    Content: () => JSX.Element;
    ContextProvider?: ((props: any) => JSX.Element) | undefined;
}) => JSX.Element;
/**
 * A component to display a playful greeting for the user.
 *
 * @public
 */
export declare const WelcomeTitle: () => JSX.Element;
/**
 * A component to display a company logo for the user.
 *
 * @public
 */
export declare const HomePageCompanyLogo: (props: {
    logo?: import("react").ReactNode;
    className?: string | undefined;
}) => JSX.Element;
/** @public */
export declare const HomePageRandomJoke: (props: import("./extensions").ComponentRenderer & {
    title?: string | undefined;
} & {
    defaultCategory?: "any" | "programming" | undefined;
}) => JSX.Element;
/**
 * A component to display a list of tools for the user.
 *
 * @public
 */
export declare const HomePageToolkit: (props: import("./extensions").ComponentRenderer & {
    title?: string | undefined;
} & ToolkitContentProps) => JSX.Element;
/**
 * A component to display a list of starred entities for the user.
 *
 * @public
 */
export declare const HomePageStarredEntities: (props: import("./extensions").ComponentRenderer & {
    title?: string | undefined;
}) => JSX.Element;
