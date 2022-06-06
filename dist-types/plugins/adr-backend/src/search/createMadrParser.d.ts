import { AdrParser } from './types';
/**
 *
 * Options for the default MADR content parser
 * @public
 */
export declare type MadrParserOptions = {
    /**
     * Location template for the route of the frontend plugin
     * Defaults to '/catalog/:namespace/:kind/:name/adrs?record=:record'
     */
    locationTemplate?: string;
    /**
     * luxon DateTime format string to parse ADR dates with.
     * Defaults to 'yyyy-MM-dd'
     */
    dateFormat?: string;
};
/**
 * Default content parser for ADRs following the MADR template (https://adr.github.io/madr/)
 * @public
 */
export declare const createMadrParser: (options?: MadrParserOptions) => AdrParser;
