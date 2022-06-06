import { Entity } from '@backstage/catalog-model';
import { AdrDocument } from '@backstage/plugin-adr-common';
/**
 * Context passed to a AdrParser.
 * @public
 */
export declare type AdrParserContext = {
    /**
     * The entity associated with the ADR.
     */
    entity: Entity;
    /**
     * The ADR content string.
     */
    content: string;
    /**
     * The ADR file path.
     */
    path: string;
};
/**
 * ADR parser function type.
 * @public
 */
export declare type AdrParser = (ctx: AdrParserContext) => Promise<AdrDocument>;
