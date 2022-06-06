/// <reference types="react" />
import { Options } from 'react-markdown';
export declare type MarkdownContentClassKey = 'markdown';
declare type Props = {
    content: string;
    dialect?: 'gfm' | 'common-mark';
    linkTarget?: Options['linkTarget'];
};
/**
 * MarkdownContent
 * --
 * Renders markdown with the default dialect [gfm - GitHub flavored Markdown](https://github.github.com/gfm/) to backstage theme styled HTML.
 * If you just want to render to plain [CommonMark](https://commonmark.org/), set the dialect to `'common-mark'`
 */
export declare function MarkdownContent(props: Props): JSX.Element;
export {};
