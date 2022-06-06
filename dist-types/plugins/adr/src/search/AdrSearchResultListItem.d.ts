/// <reference types="react" />
import { AdrDocument } from '@backstage/plugin-adr-common';
import { ResultHighlight } from '@backstage/plugin-search-common';
/**
 * A component to display a ADR search result
 * @public
 */
export declare const AdrSearchResultListItem: ({ lineClamp, highlight, result, }: {
    lineClamp?: number | undefined;
    highlight?: ResultHighlight | undefined;
    result: AdrDocument;
}) => JSX.Element;
