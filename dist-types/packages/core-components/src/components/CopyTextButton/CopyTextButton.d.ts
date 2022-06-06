/// <reference types="react" />
/**
 * Properties for {@link CopyTextButton}
 *
 * @public
 */
export interface CopyTextButtonProps {
    /**
     * The text to be copied
     */
    text: string;
    /**
     * Number of milliseconds that the tooltip is shown
     *
     * @remarks
     *
     * Default: 1000
     */
    tooltipDelay?: number;
    /**
     * Text to show in the tooltip when user has clicked the button
     *
     * @remarks
     *
     * Default: "Text copied to clipboard"
     */
    tooltipText?: string;
}
/**
 * Copy text button with visual feedback
 *
 * @public
 * @remarks
 *
 * Visual feedback takes form of:
 *  - a hover color
 *  - click ripple
 *  - Tooltip shown when user has clicked
 *
 * @example
 *
 * `<CopyTextButton text="My text that I want to be copied to the clipboard" />`
 */
export declare function CopyTextButton(props: CopyTextButtonProps): JSX.Element;
