/// <reference types="react" />
/**
 * The properties for the LogViewer component.
 *
 * @public
 */
export interface LogViewerProps {
    /**
     * The text of the logs to display.
     *
     * The LogViewer component is optimized for appending content at the end of the text.
     */
    text: string;
    /**
     * Styling overrides for classes within the LogViewer component.
     */
    classes?: {
        root?: string;
    };
}
/**
 * A component that displays logs in a scrollable text area.
 *
 * The LogViewer has support for search and filtering, as well as displaying
 * text content with ANSI color escape codes.
 *
 * Since the LogViewer uses windowing to avoid rendering all contents at once, the
 * log is sized automatically to fill the available vertical space. This means
 * it may often be needed to wrap the LogViewer in a container that provides it
 * with a fixed amount of space.
 *
 * @public
 */
export declare function LogViewer(props: LogViewerProps): JSX.Element;
