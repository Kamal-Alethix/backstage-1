/// <reference types="react" />
/**
 * @public
 */
export declare type SearchTypeAccordionProps = {
    name: string;
    types: Array<{
        value: string;
        name: string;
        icon: JSX.Element;
    }>;
    defaultValue?: string;
};
export declare const SearchTypeAccordion: (props: SearchTypeAccordionProps) => JSX.Element;
