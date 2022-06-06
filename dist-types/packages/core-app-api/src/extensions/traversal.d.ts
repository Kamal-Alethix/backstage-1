import { ReactNode, ReactElement } from 'react';
export declare type Discoverer = (element: ReactElement) => ReactNode;
export declare type Collector<Result, Context> = () => {
    accumulator: Result;
    visit(accumulator: Result, element: ReactElement, parent: ReactElement | undefined, context: Context): Context;
};
/**
 * A function that allows you to traverse a tree of React elements using
 * varying methods to discover child nodes and collect data along the way.
 */
export declare function traverseElementTree<Results>(options: {
    root: ReactNode;
    discoverers: Discoverer[];
    collectors: {
        [name in keyof Results]: Collector<Results[name], any>;
    };
}): Results;
export declare function createCollector<Result, Context>(accumulatorFactory: () => Result, visit: ReturnType<Collector<Result, Context>>['visit']): Collector<Result, Context>;
export declare function childDiscoverer(element: ReactElement): ReactNode;
export declare function routeElementDiscoverer(element: ReactElement): ReactNode;
