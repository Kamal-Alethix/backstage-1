/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import * as React from 'react';
import React__default from 'react';

/**
 * @public
 */
declare type ComponentRenderer = {
    Renderer?: (props: RendererProps) => JSX.Element;
};
declare type ComponentParts = {
    Content: (props?: any) => JSX.Element;
    Actions?: () => JSX.Element;
    Settings?: () => JSX.Element;
    ContextProvider?: (props: any) => JSX.Element;
};
declare type RendererProps = {
    title: string;
} & ComponentParts;
declare type CardExtensionProps<T> = ComponentRenderer & {
    title?: string;
} & T;
/**
 * An extension creator to create card based components for the homepage
 *
 * @public
 */
declare function createCardExtension<T>(options: {
    title: string;
    components: () => Promise<ComponentParts>;
    name?: string;
}): _backstage_core_plugin_api.Extension<(props: CardExtensionProps<T>) => JSX.Element>;

declare type Tool = {
    label: string;
    url: string;
    icon: React__default.ReactNode;
};

/**
 * Props for Toolkit content component {@link Content}.
 *
 * @public
 */
declare type ToolkitContentProps = {
    tools: Tool[];
};

/** @public */
declare const homePlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
/** @public */
declare const HomepageCompositionRoot: (props: {
    title?: string | undefined;
    children?: React.ReactNode;
}) => JSX.Element;
/** @public */
declare const ComponentAccordion: (props: {
    title: string;
    expanded?: boolean | undefined;
    Content: () => JSX.Element;
    Actions?: (() => JSX.Element) | undefined;
    Settings?: (() => JSX.Element) | undefined;
    ContextProvider?: ((props: any) => JSX.Element) | undefined;
}) => JSX.Element;
/** @public */
declare const ComponentTabs: (props: {
    title: string;
    tabs: {
        label: string;
        Component: () => JSX.Element;
    }[];
}) => JSX.Element;
/** @public */
declare const ComponentTab: (props: {
    title: string;
    Content: () => JSX.Element;
    ContextProvider?: ((props: any) => JSX.Element) | undefined;
}) => JSX.Element;
/**
 * A component to display a playful greeting for the user.
 *
 * @public
 */
declare const WelcomeTitle: () => JSX.Element;
/**
 * A component to display a company logo for the user.
 *
 * @public
 */
declare const HomePageCompanyLogo: (props: {
    logo?: React.ReactNode;
    className?: string | undefined;
}) => JSX.Element;
/** @public */
declare const HomePageRandomJoke: (props: ComponentRenderer & {
    title?: string | undefined;
} & {
    defaultCategory?: "any" | "programming" | undefined;
}) => JSX.Element;
/**
 * A component to display a list of tools for the user.
 *
 * @public
 */
declare const HomePageToolkit: (props: ComponentRenderer & {
    title?: string | undefined;
} & ToolkitContentProps) => JSX.Element;
/**
 * A component to display a list of starred entities for the user.
 *
 * @public
 */
declare const HomePageStarredEntities: (props: ComponentRenderer & {
    title?: string | undefined;
}) => JSX.Element;

declare const SettingsModal: (props: {
    open: boolean;
    close: Function;
    componentName: string;
    children: JSX.Element;
}) => JSX.Element;

declare type ClockConfig = {
    label: string;
    timeZone: string;
};
/** @public */
declare const HeaderWorldClock: (props: {
    clockConfigs: ClockConfig[];
}) => JSX.Element | null;

declare type Classes = {
    svg: string;
    path: string;
};
declare type TemplateBackstageLogoProps = {
    classes: Classes;
};
declare const TemplateBackstageLogo: (props: TemplateBackstageLogoProps) => JSX.Element;

declare const TemplateBackstageLogoIcon: () => JSX.Element;

export { ClockConfig, ComponentAccordion, ComponentRenderer, ComponentTab, ComponentTabs, HeaderWorldClock, HomePageCompanyLogo, HomePageRandomJoke, HomePageStarredEntities, HomePageToolkit, HomepageCompositionRoot, SettingsModal, TemplateBackstageLogo, TemplateBackstageLogoIcon, WelcomeTitle, createCardExtension, homePlugin };
