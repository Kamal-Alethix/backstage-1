/// <reference types="react" />
import { RenderNodeFunction, DependencyNode } from './types';
import dagre from 'dagre';
/** @public */
export declare type DependencyGraphNodeClassKey = 'node';
export declare type GraphNode<T> = dagre.Node<DependencyNode<T>>;
export declare type NodeComponentProps<T> = {
    node: GraphNode<T>;
    render?: RenderNodeFunction<T>;
    setNode: dagre.graphlib.Graph['setNode'];
};
export declare function Node<T>({ render, setNode, node, }: NodeComponentProps<T>): JSX.Element;
