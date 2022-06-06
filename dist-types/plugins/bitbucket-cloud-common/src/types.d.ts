import { PaginationOptions } from './pagination';
/** @public */
export declare type FilterAndSortOptions = {
    q?: string;
    sort?: string;
};
/** @public */
export declare type PartialResponseOptions = {
    fields?: string;
};
/** @public */
export declare type RequestOptions = FilterAndSortOptions & PaginationOptions & PartialResponseOptions & {
    [key: string]: string | number | undefined;
};
