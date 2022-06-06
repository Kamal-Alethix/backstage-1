/// <reference types="node" />
import { Logger } from 'winston';
import { ReadTreeOptions, ReadTreeResponse, ReadUrlOptions, ReadUrlResponse, SearchOptions, SearchResponse, UrlReader, UrlReaderPredicateTuple } from './types';
/**
 * A UrlReader implementation that selects from a set of UrlReaders
 * based on a predicate tied to each reader.
 */
export declare class UrlReaderPredicateMux implements UrlReader {
    private readonly logger;
    private readonly readers;
    private readonly readerWarnings;
    constructor(logger: Logger);
    register(tuple: UrlReaderPredicateTuple): void;
    read(url: string): Promise<Buffer>;
    readUrl(url: string, options?: ReadUrlOptions): Promise<ReadUrlResponse>;
    readTree(url: string, options?: ReadTreeOptions): Promise<ReadTreeResponse>;
    search(url: string, options?: SearchOptions): Promise<SearchResponse>;
    toString(): string;
}
