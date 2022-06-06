/**
 * Package encapsulating utilities to be shared by frontend TechDocs plugins.
 *
 * @packageDocumentation
 */

import { ApiRef } from '@backstage/core-plugin-api';
import { AsyncState } from 'react-use/lib/useAsync';
import { ComponentType } from 'react';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { Dispatch } from 'react';
import { Entity } from '@backstage/catalog-model';
import { Extension } from '@backstage/core-plugin-api';
import { PropsWithChildren } from 'react';
import { default as React_2 } from 'react';
import { ReactNode } from 'react';
import { SetStateAction } from 'react';

/**
 * Create a TechDocs addon overload signature without props.
 * @public
 */
export declare function createTechDocsAddonExtension(options: TechDocsAddonOptions): Extension<() => JSX.Element | null>;

/**
 * Create a TechDocs addon overload signature with props.
 * @public
 */
export declare function createTechDocsAddonExtension<TComponentProps>(options: TechDocsAddonOptions<TComponentProps>): Extension<(props: TComponentProps) => JSX.Element | null>;

/**
 * Name for the event dispatched when ShadowRoot styles are loaded.
 * @public
 */
export declare const SHADOW_DOM_STYLE_LOAD_EVENT = "TECH_DOCS_SHADOW_DOM_STYLE_LOAD";

/**
 * The outcome of a docs sync operation.
 *
 * @public
 */
export declare type SyncResult = 'cached' | 'updated';

/**
 * Marks the <TechDocsAddons> registry component.
 * @public
 */
export declare const TECHDOCS_ADDONS_WRAPPER_KEY = "techdocs.addons.wrapper.v1";

/**
 * Locations for which TechDocs addons may be declared and rendered.
 * @public
 */
export declare const TechDocsAddonLocations: Readonly<{
    /**
     * These addons fill up the header from the right, on the same line as the
     * title.
     */
    readonly Header: "Header";
    /**
     * These addons appear below the header and above all content; tooling addons
     * can be inserted for convenience.
     */
    readonly Subheader: "Subheader";
    /**
     * These addons are items added to the settings menu list and are designed to make
     * the reader experience customizable, for example accessibility options
     */
    readonly Settings: "Settings";
    /**
     * These addons appear left of the content and above the navigation.
     */
    readonly PrimarySidebar: "PrimarySidebar";
    /**
     * These addons appear right of the content and above the table of contents.
     */
    readonly SecondarySidebar: "SecondarySidebar";
    /**
     * A virtual location which allows mutation of all content within the shadow
     * root by transforming DOM nodes. These addons should return null on render.
     */
    readonly Content: "Content";
}>;

/**
 * Options for creating a TechDocs addon.
 * @public
 */
export declare type TechDocsAddonOptions<TAddonProps = {}> = {
    name: string;
    location: keyof typeof TechDocsAddonLocations;
    component: ComponentType<TAddonProps>;
};

/**
 * TechDocs Addon registry.
 * @public
 */
export declare const TechDocsAddons: React_2.ComponentType;

/**
 * API to talk to techdocs-backend.
 *
 * @public
 */
export declare interface TechDocsApi {
    getApiOrigin(): Promise<string>;
    getTechDocsMetadata(entityId: CompoundEntityRef): Promise<TechDocsMetadata>;
    getEntityMetadata(entityId: CompoundEntityRef): Promise<TechDocsEntityMetadata>;
}

/**
 * Utility API reference for the {@link TechDocsApi}.
 *
 * @public
 */
export declare const techdocsApiRef: ApiRef<TechDocsApi>;

/**
 * Metadata for TechDocs Entity
 *
 * @public
 */
export declare type TechDocsEntityMetadata = Entity & {
    locationMetadata?: {
        type: string;
        target: string;
    };
};

/**
 * Metadata for TechDocs page
 *
 * @public
 */
export declare type TechDocsMetadata = {
    site_name: string;
    site_description: string;
};

/**
 * A context to store the reader page state
 * @public
 */
export declare const TechDocsReaderPageProvider: React_2.MemoExoticComponent<({ entityRef, children }: TechDocsReaderPageProviderProps) => JSX.Element>;

/**
 * Props for {@link TechDocsReaderPageProvider}
 *
 * @public
 */
export declare type TechDocsReaderPageProviderProps = {
    entityRef: CompoundEntityRef;
    children: TechDocsReaderPageProviderRenderFunction | ReactNode;
};

/**
 * render function for {@link TechDocsReaderPageProvider}
 *
 * @public
 */
export declare type TechDocsReaderPageProviderRenderFunction = (value: TechDocsReaderPageValue) => JSX.Element;

/**
 * @public type for the value of the TechDocsReaderPageContext
 */
export declare type TechDocsReaderPageValue = {
    metadata: AsyncState<TechDocsMetadata>;
    entityRef: CompoundEntityRef;
    entityMetadata: AsyncState<TechDocsEntityMetadata>;
    shadowRoot?: ShadowRoot;
    setShadowRoot: Dispatch<SetStateAction<ShadowRoot | undefined>>;
    title: string;
    setTitle: Dispatch<SetStateAction<string>>;
    subtitle: string;
    setSubtitle: Dispatch<SetStateAction<string>>;
    /**
     * @deprecated property can be passed down directly to the `TechDocsReaderPageContent` instead.
     */
    onReady?: () => void;
};

/**
 * Renders a tree of elements in a Shadow DOM.
 *
 * @remarks
 * Centers the styles loaded event to avoid having multiple locations setting the opacity style in Shadow DOM causing the screen to flash multiple times,
 * so if you want to know when Shadow DOM styles are computed, you can listen for the "TECH_DOCS_SHADOW_DOM_STYLE_LOAD" event dispatched by the element tree.
 *
 * @example
 * Here is an example using this component and also listening for styles loaded event:
 *```jsx
 * import {
 *   TechDocsShadowDom,
 *   SHADOW_DOM_STYLE_LOAD_EVENT,
 * } from '@backstage/plugin-techdocs-react';
 *
 * export const TechDocsReaderPageContent = ({ entity }: TechDocsReaderPageContentProps) => {
 *   // ...
 *   const dom = useTechDocsReaderDom(entity);
 *
 *   useEffect(() => {
 *     const updateSidebarPosition = () => {
 *       // ...
 *     };
 *     dom?.addEventListener(SHADOW_DOM_STYLE_LOAD_EVENT, updateSidebarPosition);
 *     return () => {
 *       dom?.removeEventListener(SHADOW_DOM_STYLE_LOAD_EVENT, updateSidebarPosition);
 *     };
 *   }, [dom]);
 *
 *   const handleDomAppend = useCallback(
 *     (newShadowRoot: ShadowRoot) => {
 *       setShadowRoot(newShadowRoot);
 *     },
 *     [setShadowRoot],
 *   );
 *
 *   return <TechDocsShadowDom element={dom} onAppend={handleDomAppend} />;
 * };
 * ```
 *
 * @param props - see {@link TechDocsShadowDomProps}.
 * @public
 */
export declare const TechDocsShadowDom: ({ element, onAppend, children, }: TechDocsShadowDomProps) => JSX.Element;

/**
 * Props for {@link TechDocsShadowDom}.
 *
 * @remarks
 * If you want to use portals to render Material UI components in the Shadow DOM,
 * you must render these portals as children because this component wraps its children in a Material UI StylesProvider
 * to ensure that Material UI styles are applied.
 *
 * @public
 */
export declare type TechDocsShadowDomProps = PropsWithChildren<{
    /**
     * Element tree that is appended to ShadowRoot.
     */
    element: Element;
    /**
     * Callback called when the element tree is appended in ShadowRoot.
     */
    onAppend?: (shadowRoot: ShadowRoot) => void;
}>;

/**
 * API which talks to TechDocs storage to fetch files to render.
 *
 * @public
 */
export declare interface TechDocsStorageApi {
    getApiOrigin(): Promise<string>;
    getStorageUrl(): Promise<string>;
    getBuilder(): Promise<string>;
    getEntityDocs(entityId: CompoundEntityRef, path: string): Promise<string>;
    syncEntityDocs(entityId: CompoundEntityRef, logHandler?: (line: string) => void): Promise<SyncResult>;
    getBaseUrl(oldBaseUrl: string, entityId: CompoundEntityRef, path: string): Promise<string>;
}

/**
 * Utility API reference for the {@link TechDocsStorageApi}.
 *
 * @public
 */
export declare const techdocsStorageApiRef: ApiRef<TechDocsStorageApi>;

/**
 * Returns the style's loading state.
 *
 * @example
 * Here's an example that updates the sidebar position only after styles are calculated:
 * ```jsx
 * import {
 *   TechDocsShadowDom,
 *   useShadowDomStylesLoading,
 * } from '@backstage/plugin-techdocs-react';
 *
 * export const TechDocsReaderPageContent = () => {
 *   // ...
 *   const dom = useTechDocsReaderDom(entity);
 *   const isStyleLoading = useShadowDomStylesLoading(dom);
 *
 *   const updateSidebarPosition = useCallback(() => {
 *     //...
 *   }, [dom]);
 *
 *   useEffect(() => {
 *     if (!isStyleLoading) {
 *       updateSidebarPosition();
 *     }
 *   }, [isStyleLoading, updateSidebarPosition]);
 *
 *   const handleDomAppend = useCallback(
 *     (newShadowRoot: ShadowRoot) => {
 *       setShadowRoot(newShadowRoot);
 *     },
 *     [setShadowRoot],
 *   );
 *
 *   return <TechDocsShadowDom element={dom} onAppend={handleDomAppend} />;
 * };
 * ```
 *
 * @param element - which is the ShadowRoot tree.
 * @returns a boolean value, true if styles are being loaded.
 * @public
 */
export declare const useShadowDomStylesLoading: (element: Element | null) => boolean;

/**
 * Hook for use within TechDocs addons that provides access to the underlying
 * shadow root of the current page, allowing the DOM within to be mutated.
 * @public
 */
export declare const useShadowRoot: () => ShadowRoot | undefined;

/**
 * Convenience hook for use within TechDocs addons that provides access to
 * elements that match a given selector within the shadow root.
 *
 * @public
 */
export declare const useShadowRootElements: <TReturnedElement extends HTMLElement = HTMLElement>(selectors: string[]) => TReturnedElement[];

/**
 * Hook for retreiving a selection within the ShadowRoot.
 * @public
 */
export declare const useShadowRootSelection: (wait?: number) => Selection | null;

/**
 * hook to use addons in components
 * @public
 */
export declare const useTechDocsAddons: () => {
    renderComponentByName: (name: string) => JSX.Element | null;
    renderComponentsByLocation: (location: keyof typeof TechDocsAddonLocations) => (JSX.Element | null)[] | null;
};

/**
 * Hook used to get access to shared state between reader page components.
 * @public
 */
export declare const useTechDocsReaderPage: () => TechDocsReaderPageValue;

export { }
