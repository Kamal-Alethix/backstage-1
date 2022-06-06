import React from 'react';
import { DependencyEdge, DependencyNode, Direction, Alignment, Ranker, RenderNodeFunction, RenderLabelFunction, LabelPosition } from './types';
/**
 * Properties of {@link DependencyGraph}
 *
 * @public
 * @remarks
 * <NodeData> and <EdgeData> are useful when rendering custom or edge labels
 */
export interface DependencyGraphProps<NodeData, EdgeData> extends React.SVGProps<SVGSVGElement> {
    /**
     * Edges of graph
     */
    edges: DependencyEdge<EdgeData>[];
    /**
     * Nodes of Graph
     */
    nodes: DependencyNode<NodeData>[];
    /**
     * Graph {@link DependencyGraphTypes.Direction | direction}
     *
     * @remarks
     *
     * Default: `DependencyGraphTypes.Direction.TOP_BOTTOM`
     */
    direction?: Direction;
    /**
     * Node {@link DependencyGraphTypes.Alignment | alignment}
     */
    align?: Alignment;
    /**
     * Margin between nodes on each rank
     *
     * @remarks
     *
     * Default: 50
     */
    nodeMargin?: number;
    /**
     * Margin between edges
     *
     * @remarks
     *
     * Default: 10
     */
    edgeMargin?: number;
    /**
     * Margin between each rank
     *
     * @remarks
     *
     * Default: 50
     */
    rankMargin?: number;
    /**
     * Margin on left and right of whole graph
     *
     * @remarks
     *
     * Default: 0
     */
    paddingX?: number;
    /**
     * Margin on top and bottom of whole graph
     *
     * @remarks
     *
     * Default: 0
     */
    paddingY?: number;
    /**
     * Heuristic used to find set of edges that will make graph acyclic
     */
    acyclicer?: 'greedy';
    /**
     * {@link DependencyGraphTypes.Ranker | Algorithm} used to rank nodes
     *
     * @remarks
     *
     * Default: `DependencyGraphTypes.Ranker.NETWORK_SIMPLEX`
     */
    ranker?: Ranker;
    /**
     * {@link DependencyGraphTypes.LabelPosition | Position} of label in relation to edge
     *
     * @remarks
     *
     * Default: `DependencyGraphTypes.LabelPosition.RIGHT`
     */
    labelPosition?: LabelPosition;
    /**
     * How much to move label away from edge
     *
     * @remarks
     *
     * Applies only when {@link DependencyGraphProps.labelPosition} is `DependencyGraphTypes.LabelPosition.LEFT` or
     * `DependencyGraphTypes.LabelPosition.RIGHT`
     */
    labelOffset?: number;
    /**
     * Minimum number of ranks to keep between connected nodes
     */
    edgeRanks?: number;
    /**
     * Weight applied to edges in graph
     */
    edgeWeight?: number;
    /**
     * Custom node rendering component
     */
    renderNode?: RenderNodeFunction<NodeData>;
    /**
     * Custom label rendering component
     */
    renderLabel?: RenderLabelFunction<EdgeData>;
    /**
     * {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs | Defs} shared by rendered SVG to be used by
     * {@link DependencyGraphProps.renderNode} and/or {@link DependencyGraphProps.renderLabel}
     */
    defs?: SVGDefsElement | SVGDefsElement[];
    /**
     * Controls zoom behavior of graph
     *
     * @remarks
     *
     * Default: `enabled`
     */
    zoom?: 'enabled' | 'disabled' | 'enable-on-click';
}
/**
 * Graph component used to visualize relations between entities
 *
 * @public
 */
export declare function DependencyGraph<NodeData, EdgeData>(props: DependencyGraphProps<NodeData, EdgeData>): JSX.Element;
