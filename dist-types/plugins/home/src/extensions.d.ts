/// <reference types="react" />
/**
 * @public
 */
export declare type ComponentRenderer = {
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
export declare function createCardExtension<T>(options: {
    title: string;
    components: () => Promise<ComponentParts>;
    name?: string;
}): import("@backstage/core-plugin-api").Extension<(props: CardExtensionProps<T>) => JSX.Element>;
export {};
