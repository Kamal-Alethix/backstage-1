/// <reference types="react" />
/**
 * Props for {@link CatalogKindHeader}.
 *
 * @public
 */
export interface CatalogKindHeaderProps {
    /**
     * Entity kinds to show in the dropdown; by default all kinds are fetched from the catalog and
     * displayed.
     */
    allowedKinds?: string[];
    /**
     * The initial kind to select; defaults to 'component'. A kind filter entered directly in the
     * query parameter will override this value.
     */
    initialFilter?: string;
}
/** @public */
export declare function CatalogKindHeader(props: CatalogKindHeaderProps): JSX.Element;
