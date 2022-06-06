import { PropsWithChildren } from 'react';
/**
 * Name for the event dispatched when ShadowRoot styles are loaded.
 * @public
 */
export declare const SHADOW_DOM_STYLE_LOAD_EVENT = "TECH_DOCS_SHADOW_DOM_STYLE_LOAD";
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
