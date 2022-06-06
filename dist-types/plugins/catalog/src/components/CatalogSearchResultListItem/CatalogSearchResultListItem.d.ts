/// <reference types="react" />
import { IndexableDocument, ResultHighlight } from '@backstage/plugin-search-common';
/**
 * Props for {@link CatalogSearchResultListItem}.
 *
 * @public
 */
export interface CatalogSearchResultListItemProps {
    result: IndexableDocument;
    highlight?: ResultHighlight;
}
/** @public */
export declare function CatalogSearchResultListItem(props: CatalogSearchResultListItemProps): JSX.Element;
