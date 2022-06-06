/// <reference types="node" />
import { ReaderFactory, ReadTreeResponse, ReadUrlOptions, ReadUrlResponse, SearchResponse, UrlReader } from './types';
/**
 * A {@link UrlReader} that does a plain fetch of the URL.
 *
 * @public
 */
export declare class FetchUrlReader implements UrlReader {
    /**
     * The factory creates a single reader that will be used for reading any URL that's listed
     * in configuration at `backend.reading.allow`. The allow list contains a list of objects describing
     * targets to allow, containing the following fields:
     *
     * `host`:
     *   Either full hostnames to match, or subdomain wildcard matchers with a leading `*`.
     *   For example `example.com` and `*.example.com` are valid values, `prod.*.example.com` is not.
     *
     * `paths`:
     *   An optional list of paths which are allowed. If the list is omitted all paths are allowed.
     */
    static factory: ReaderFactory;
    read(url: string): Promise<Buffer>;
    readUrl(url: string, options?: ReadUrlOptions): Promise<ReadUrlResponse>;
    readTree(): Promise<ReadTreeResponse>;
    search(): Promise<SearchResponse>;
    toString(): string;
}
