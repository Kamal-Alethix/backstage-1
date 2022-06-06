/// <reference types="react" />
import { ResultHighlight } from '@backstage/plugin-search-common';
/**
 * Props for {@link TechDocsSearchResultListItem}.
 *
 * @public
 */
export declare type TechDocsSearchResultListItemProps = {
    result: any;
    highlight?: ResultHighlight;
    lineClamp?: number;
    asListItem?: boolean;
    asLink?: boolean;
    title?: string;
};
/**
 * Component which renders documentation and related metadata.
 *
 * @public
 */
export declare const TechDocsSearchResultListItem: (props: TechDocsSearchResultListItemProps) => JSX.Element;
