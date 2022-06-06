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
