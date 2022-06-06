/**
 * Parses the facets part of a facet query, like
 * /entity-facets?filter=metadata.namespace=default,kind=Component&facet=metadata.namespace
 */
export declare function parseEntityFacetParams(params: Record<string, unknown>): string[];
