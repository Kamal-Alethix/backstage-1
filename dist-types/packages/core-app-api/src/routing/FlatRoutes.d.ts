import { ReactNode } from 'react';
/**
 * Props for the {@link FlatRoutes} component.
 *
 * @public
 */
export declare type FlatRoutesProps = {
    children: ReactNode;
};
/**
 * A wrapper around a set of routes.
 *
 * @remarks
 *
 * The root of the routing hierarchy in your app should use this component,
 * instead of the one from `react-router-dom`. This ensures that all of the
 * plugin route and utility API wiring happens under the hood.
 *
 * @public
 */
export declare const FlatRoutes: (props: FlatRoutesProps) => JSX.Element | null;
