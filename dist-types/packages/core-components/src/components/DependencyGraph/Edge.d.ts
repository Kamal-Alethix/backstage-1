/// <reference types="react" />
import { RenderLabelFunction, DependencyEdge, LabelPosition } from './types';
import dagre from 'dagre';
export declare type EdgeProperties = {
    label?: string;
    width?: number;
    height?: number;
    labeloffset?: number;
    labelpos?: LabelPosition;
    minlen?: number;
    weight?: number;
};
export declare type GraphEdge<T> = DependencyEdge<T> & dagre.GraphEdge & EdgeProperties;
/** @public */
export declare type DependencyGraphEdgeClassKey = 'path' | 'label';
/** @public */
export declare type EdgeComponentProps<T = unknown> = {
    id: dagre.Edge;
    edge: GraphEdge<T>;
    render?: RenderLabelFunction<T>;
    setEdge: (id: dagre.Edge, edge: DependencyEdge<T>) => dagre.graphlib.Graph<{}>;
};
export declare function Edge<EdgeData>({ render, setEdge, id, edge, }: EdgeComponentProps<EdgeData>): JSX.Element;
