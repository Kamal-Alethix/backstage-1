/// <reference types="react" />
import { ErrorPanelProps } from '../ErrorPanel';
export declare type ResponseErrorPanelClassKey = 'text' | 'divider';
/**
 * Renders a warning panel as the effect of a failed server request.
 *
 * Has special treatment for ResponseError errors, to display rich
 * server-provided information about what happened.
 */
export declare function ResponseErrorPanel(props: ErrorPanelProps): JSX.Element;
