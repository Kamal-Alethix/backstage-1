/// <reference types="react" />
import { DependencyGraphTypes } from '@backstage/core-components';
import { EntityNodeData } from './types';
export declare function CustomNode({ node: { id, kind, namespace, name, color, focused, title, onClick, }, }: DependencyGraphTypes.RenderNodeProps<EntityNodeData>): JSX.Element;
