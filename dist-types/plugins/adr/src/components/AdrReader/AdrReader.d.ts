/// <reference types="react" />
import { AdrContentDecorator } from './types';
/**
 * Component to fetch and render an ADR.
 * @public
 */
export declare const AdrReader: {
    ({ adr, decorators, }: {
        adr: string;
        decorators?: AdrContentDecorator[] | undefined;
    }): JSX.Element;
    decorators: Readonly<{
        createRewriteRelativeLinksDecorator(): AdrContentDecorator;
        createRewriteRelativeEmbedsDecorator(): AdrContentDecorator;
    }>;
};
