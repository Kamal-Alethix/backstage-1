import { ComponentType, ReactNode, ReactElement } from 'react';
import { RouteRef, ExternalRouteRef } from '@backstage/core-plugin-api';
import { RenderResult } from '@testing-library/react';
/**
 * Options to customize the behavior of the test app wrapper.
 * @public
 */
export declare type TestAppOptions = {
    /**
     * Initial route entries to pass along as `initialEntries` to the router.
     */
    routeEntries?: string[];
    /**
     * An object of paths to mount route ref on, with the key being the path and the value
     * being the RouteRef that the path will be bound to. This allows the route refs to be
     * used by `useRouteRef` in the rendered elements.
     *
     * @example
     * wrapInTestApp(<MyComponent />, \{
     *   mountedRoutes: \{
     *     '/my-path': myRouteRef,
     *   \}
     * \})
     * // ...
     * const link = useRouteRef(myRouteRef)
     */
    mountedRoutes?: {
        [path: string]: RouteRef | ExternalRouteRef;
    };
};
/**
 * Creates a Wrapper component that wraps a component inside a Backstage test app,
 * providing a mocked theme and app context, along with mocked APIs.
 *
 * @param options - Additional options for the rendering.
 * @public
 */
export declare function createTestAppWrapper(options?: TestAppOptions): (props: {
    children: ReactNode;
}) => JSX.Element;
/**
 * Wraps a component inside a Backstage test app, providing a mocked theme
 * and app context, along with mocked APIs.
 *
 * @param Component - A component or react node to render inside the test app.
 * @param options - Additional options for the rendering.
 * @public
 */
export declare function wrapInTestApp(Component: ComponentType | ReactNode, options?: TestAppOptions): ReactElement;
/**
 * Renders a component inside a Backstage test app, providing a mocked theme
 * and app context, along with mocked APIs.
 *
 * The render executes async effects similar to `renderWithEffects`. To avoid this
 * behavior, use a regular `render()` + `wrapInTestApp()` instead.
 *
 * @param Component - A component or react node to render inside the test app.
 * @param options - Additional options for the rendering.
 * @public
 */
export declare function renderInTestApp(Component: ComponentType | ReactNode, options?: TestAppOptions): Promise<RenderResult>;
