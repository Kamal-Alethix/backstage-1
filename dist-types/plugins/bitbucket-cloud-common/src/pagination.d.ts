import { Models } from './models';
/** @public */
export declare type PaginationOptions = {
    page?: number;
    pagelen?: number;
};
/** @public */
export declare class WithPagination<TPage extends Models.Paginated<TResultItem>, TResultItem> {
    private readonly createUrl;
    private readonly fetch;
    constructor(createUrl: (options: PaginationOptions) => URL, fetch: (url: URL) => Promise<TPage>);
    getPage(options?: PaginationOptions): Promise<TPage>;
    iteratePages(options?: PaginationOptions): AsyncGenerator<TPage, void>;
    iterateResults(options?: PaginationOptions): AsyncGenerator<Awaited<TResultItem>, void, unknown>;
}
