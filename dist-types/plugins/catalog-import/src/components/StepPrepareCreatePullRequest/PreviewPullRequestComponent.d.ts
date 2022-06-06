/// <reference types="react" />
/**
 * Props for {@link PreviewPullRequestComponent}.
 *
 * @public
 */
export interface PreviewPullRequestComponentProps {
    title: string;
    description: string;
    classes?: {
        card?: string;
        cardContent?: string;
    };
}
/**
 * Previews a pull request.
 *
 * @public
 */
export declare const PreviewPullRequestComponent: (props: PreviewPullRequestComponentProps) => JSX.Element;
