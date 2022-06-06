/// <reference types="react" />
import { RouteRef } from '../routing';
import { Extension } from '../plugin/types';
/**
 * Lazy or synchronous retrieving of extension components.
 *
 * @public
 */
export declare type ComponentLoader<T> = {
    lazy: () => Promise<T>;
} | {
    sync: T;
};
/**
 * Extension for components that can have its own URL route (top-level pages, tabs etc.).
 *
 * @remarks
 *
 * We do not use ComponentType as the return type, since it doesn't let us convey the children prop.
 * ComponentType inserts children as an optional prop whether the inner component accepts it or not,
 * making it impossible to make the usage of children type safe.
 *
 * See {@link https://backstage.io/docs/plugins/composability#extensions}.
 *
 * @public
 */
export declare function createRoutableExtension<T extends (props: any) => JSX.Element | null>(options: {
    /**
     * A loader for the component that is rendered by this extension.
     */
    component: () => Promise<T>;
    /**
     * The mount point to bind this routable extension to.
     *
     * If this extension is placed somewhere in the app element tree of a Backstage
     * app, callers will be able to route to this extensions by calling,
     * `useRouteRef` with this mount point.
     */
    mountPoint: RouteRef;
    /**
     * The name of this extension that will represent it at runtime. It is for example
     * used to identify this extension in analytics data.
     *
     * If possible the name should always be the same as the name of the exported
     * variable for this extension.
     */
    name?: string;
}): Extension<T>;
/**
 * Plain React component extension.
 *
 * @remarks
 *
 * We do not use ComponentType as the return type, since it doesn't let us convey the children prop.
 * ComponentType inserts children as an optional prop whether the inner component accepts it or not,
 * making it impossible to make the usage of children type safe.
 *
 * See {@link https://backstage.io/docs/plugins/composability#extensions}.
 *
 * @public
 */
export declare function createComponentExtension<T extends (props: any) => JSX.Element | null>(options: {
    /**
     * A loader or synchronously supplied component that is rendered by this extension.
     */
    component: ComponentLoader<T>;
    /**
     * The name of this extension that will represent it at runtime. It is for example
     * used to identify this extension in analytics data.
     *
     * If possible the name should always be the same as the name of the exported
     * variable for this extension.
     */
    name?: string;
}): Extension<T>;
/**
 * Used by {@link createComponentExtension} and {@link createRoutableExtension}.
 *
 * @remarks
 *
 * We do not use ComponentType as the return type, since it doesn't let us convey the children prop.
 * ComponentType inserts children as an optional prop whether the inner component accepts it or not,
 * making it impossible to make the usage of children type safe.
 *
 * See {@link https://backstage.io/docs/plugins/composability#extensions}.
 *
 * @public
 */
export declare function createReactExtension<T extends (props: any) => JSX.Element | null>(options: {
    /**
     * A loader or synchronously supplied component that is rendered by this extension.
     */
    component: ComponentLoader<T>;
    /**
     * Additional component data that is attached to the top-level extension component.
     */
    data?: Record<string, unknown>;
    /**
     * The name of this extension that will represent it at runtime. It is for example
     * used to identify this extension in analytics data.
     *
     * If possible the name should always be the same as the name of the exported
     * variable for this extension.
     */
    name?: string;
}): Extension<T>;
