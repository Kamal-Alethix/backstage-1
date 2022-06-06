/// <reference types="react" />
import { SearchTypeAccordionProps } from './SearchType.Accordion';
import { SearchTypeTabsProps } from './SearchType.Tabs';
/**
 * @public
 */
export declare type SearchTypeProps = {
    className?: string;
    name: string;
    values?: string[];
    defaultValue?: string[] | string | null;
};
declare const SearchType: {
    (props: SearchTypeProps): JSX.Element;
    /**
     * A control surface for the search query's "types" property, displayed as a
     * single-select collapsible accordion suitable for use in faceted search UIs.
     * @public
     */
    Accordion(props: SearchTypeAccordionProps): JSX.Element;
    /**
     * A control surface for the search query's "types" property, displayed as a
     * tabs suitable for use in faceted search UIs.
     * @public
     */
    Tabs(props: SearchTypeTabsProps): JSX.Element;
};
export { SearchType };
export type { SearchTypeAccordionProps, SearchTypeTabsProps };
