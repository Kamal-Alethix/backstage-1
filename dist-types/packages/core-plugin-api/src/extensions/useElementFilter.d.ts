import { ReactNode, ReactElement } from 'react';
/**
 * A querying interface tailored to traversing a set of selected React elements
 * and extracting data.
 *
 * @remarks
 *
 * Methods prefixed with `selectBy` are used to narrow the set of selected elements.
 *
 * Methods prefixed with `find` return concrete data using a deep traversal of the set.
 *
 * Methods prefixed with `get` return concrete data using a shallow traversal of the set.
 *
 * @public
 */
export interface ElementCollection {
    /**
     * Narrows the set of selected components by doing a deep traversal and
     * only including those that have defined component data for the given `key`.
     *
     * @remarks
     *
     * Whether an element in the tree has component data set for the given key
     * is determined by whether `getComponentData` returns undefined.
     *
     * The traversal does not continue deeper past elements that match the criteria,
     * and it also includes the root children in the selection, meaning that if the,
     * of all the currently selected elements contain data for the given key, this
     * method is a no-op.
     *
     * If `withStrictError` is set, the resulting selection must be a full match, meaning
     * there may be no elements that were excluded in the selection. If the selection
     * is not a clean match, an error will be throw with `withStrictError` as the message.
     *
     * @param query - Filtering query.
     */
    selectByComponentData(query: {
        key: string;
        withStrictError?: string;
    }): ElementCollection;
    /**
     * Finds all elements using the same criteria as `selectByComponentData`, but
     * returns the actual component data of each of those elements instead.
     *
     * @param query - Lookup query.
     */
    findComponentData<T>(query: {
        key: string;
    }): T[];
    /**
     * Returns all of the elements currently selected by this collection.
     */
    getElements<Props extends {
        [name: string]: unknown;
    }>(): Array<ReactElement<Props>>;
}
/**
 * useElementFilter is a utility that helps you narrow down and retrieve data
 * from a React element tree, typically operating on the `children` property
 * passed in to a component.
 *
 * @remarks
 *
 * A common use-case is to construct declarative APIs
 * where a React component defines its behavior based on its children, such as
 * the relationship between `Routes` and `Route` in `react-router`.
 *
 * The purpose of this hook is similar to `React.Children.map`, and it expands upon
 * it to also handle traversal of fragments and Backstage specific things like the
 * `FeatureFlagged` component.
 *
 * The return value of the hook is computed by the provided filter function, but
 * with added memoization based on the input `node`. If further memoization
 * dependencies are used in the filter function, they should be added to the
 * third `dependencies` argument, just like `useMemo`, `useEffect`, etc.
 *
 * @public
 */
export declare function useElementFilter<T>(node: ReactNode, filterFn: (arg: ElementCollection) => T, dependencies?: any[]): T;
