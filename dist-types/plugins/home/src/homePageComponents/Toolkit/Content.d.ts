/// <reference types="react" />
import { Tool } from './Context';
/**
 * Props for Toolkit content component {@link Content}.
 *
 * @public
 */
export declare type ToolkitContentProps = {
    tools: Tool[];
};
/**
 * A component to display a list of tools for the user.
 *
 * @public
 */
export declare const Content: (props: ToolkitContentProps) => JSX.Element;
