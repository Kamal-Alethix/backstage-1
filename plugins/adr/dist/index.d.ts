/// <reference types="react" />
import * as _backstage_plugin_adr_common from '@backstage/plugin-adr-common';
import { AdrDocument } from '@backstage/plugin-adr-common';
export { isAdrAvailable } from '@backstage/plugin-adr-common';
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { ResultHighlight } from '@backstage/plugin-search-common';

/**
 * ADR content decorator function type. Decorators are responsible for
 * performing any necessary transformations on the ADR content before rendering.
 * @public
 */
declare type AdrContentDecorator = (adrInfo: {
    baseUrl: string;
    content: string;
}) => {
    content: string;
};

/**
 * Component to fetch and render an ADR.
 * @public
 */
declare const AdrReader: {
    ({ adr, decorators, }: {
        adr: string;
        decorators?: AdrContentDecorator[] | undefined;
    }): JSX.Element;
    decorators: Readonly<{
        createRewriteRelativeLinksDecorator(): AdrContentDecorator;
        createRewriteRelativeEmbedsDecorator(): AdrContentDecorator;
    }>;
};

/**
 * The Backstage plugin that holds ADR specific components
 * @public
 */
declare const adrPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
/**
 * An extension for browsing ADRs on an entity page.
 * @public
 */
declare const EntityAdrContent: ({ contentDecorators, filePathFilterFn, }: {
    contentDecorators?: AdrContentDecorator[] | undefined;
    filePathFilterFn?: _backstage_plugin_adr_common.AdrFilePathFilterFn | undefined;
}) => JSX.Element;

/**
 * A component to display a ADR search result
 * @public
 */
declare const AdrSearchResultListItem: ({ lineClamp, highlight, result, }: {
    lineClamp?: number | undefined;
    highlight?: ResultHighlight | undefined;
    result: AdrDocument;
}) => JSX.Element;

export { AdrContentDecorator, AdrReader, AdrSearchResultListItem, EntityAdrContent, adrPlugin };
