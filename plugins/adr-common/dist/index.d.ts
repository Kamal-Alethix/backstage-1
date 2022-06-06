import { Entity } from '@backstage/catalog-model';
import { IndexableDocument } from '@backstage/plugin-search-common';
import { ScmIntegrationRegistry } from '@backstage/integration';

/**
 * Common types and functionalities for the ADR plugin.
 * @packageDocumentation
 */

/**
 * ADR plugin annotation.
 * @public
 */
declare const ANNOTATION_ADR_LOCATION = "backstage.io/adr-location";
/**
 * Standard luxon DateTime format string for MADR dates.
 * @public
 */
declare const MADR_DATE_FORMAT = "yyyy-MM-dd";
/**
 * Utility function to determine if the given entity has ADRs.
 * @public
 */
declare const isAdrAvailable: (entity: Entity) => boolean;
/**
 * Utility function to extract the ADR location URL from an entity based off
 * its ADR annotation and relative to the entity source location.
 * @public
 */
declare const getAdrLocationUrl: (entity: Entity, scmIntegration: ScmIntegrationRegistry) => string;
/**
 * File path filter function type for ADR filenames
 * @public
 */
declare type AdrFilePathFilterFn = (path: string) => boolean;
/**
 * File path filter for MADR filename formats
 * @public
 */
declare const madrFilePathFilter: AdrFilePathFilterFn;
/**
 * ADR indexable document interface
 * @public
 */
interface AdrDocument extends IndexableDocument {
    /**
     * ADR status label
     */
    status?: string;
    /**
     * ADR date
     */
    date?: string;
}

export { ANNOTATION_ADR_LOCATION, AdrDocument, AdrFilePathFilterFn, MADR_DATE_FORMAT, getAdrLocationUrl, isAdrAvailable, madrFilePathFilter };
