/// <reference types="react" />
/**
 * Properties for {@link CodeSnippet}
 *
 * @public
 */
export interface CodeSnippetProps {
    /**
     * Code Snippet text
     */
    text: string;
    /**
     * Language used by {@link CodeSnippetProps.text}
     */
    language: string;
    /**
     * Whether to show line number
     *
     * @remarks
     *
     * Default: false
     */
    showLineNumbers?: boolean;
    /**
     * Whether to show button to copy code snippet
     *
     * @remarks
     *
     * Default: false
     */
    showCopyCodeButton?: boolean;
    /**
     * Array of line numbers to highlight
     */
    highlightedNumbers?: number[];
    /**
     * Custom styles applied to code
     *
     * @remarks
     *
     * Passed to {@link https://react-syntax-highlighter.github.io/react-syntax-highlighter/ | react-syntax-highlighter}
     */
    customStyle?: any;
}
/**
 * Thin wrapper on top of {@link https://react-syntax-highlighter.github.io/react-syntax-highlighter/ | react-syntax-highlighter}
 * providing consistent theming and copy code button
 *
 * @public
 */
export declare function CodeSnippet(props: CodeSnippetProps): JSX.Element;
