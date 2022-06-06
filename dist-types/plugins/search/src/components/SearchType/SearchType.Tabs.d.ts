/// <reference types="react" />
/**
 * @public
 */
export declare type SearchTypeTabsProps = {
    types: Array<{
        value: string;
        name: string;
    }>;
    defaultValue?: string;
};
export declare const SearchTypeTabs: (props: SearchTypeTabsProps) => JSX.Element;
