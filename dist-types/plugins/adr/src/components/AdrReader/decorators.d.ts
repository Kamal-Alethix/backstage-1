import { AdrContentDecorator } from './types';
/**
 *
 * Factory for creating default ADR content decorators. The adrDecoratorFactories
 * symbol is not directly exported, but through the AdrReader.decorators field.
 * @public
 */
export declare const adrDecoratorFactories: Readonly<{
    /**
     * Rewrites relative Markdown links as absolute links.
     */
    createRewriteRelativeLinksDecorator(): AdrContentDecorator;
    /**
     * Rewrites relative Markdown embeds using absolute URLs.
     */
    createRewriteRelativeEmbedsDecorator(): AdrContentDecorator;
}>;
