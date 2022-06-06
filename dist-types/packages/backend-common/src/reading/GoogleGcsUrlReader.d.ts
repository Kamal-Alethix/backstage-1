/// <reference types="node" />
import { Storage } from '@google-cloud/storage';
import { ReaderFactory, ReadTreeResponse, ReadUrlOptions, ReadUrlResponse, SearchResponse, UrlReader } from './types';
import { GoogleGcsIntegrationConfig } from '@backstage/integration';
/**
 * Implements a {@link UrlReader} for files on Google GCS.
 *
 * @public
 */
export declare class GoogleGcsUrlReader implements UrlReader {
    private readonly integration;
    private readonly storage;
    static factory: ReaderFactory;
    constructor(integration: GoogleGcsIntegrationConfig, storage: Storage);
    private readStreamFromUrl;
    read(url: string): Promise<Buffer>;
    readUrl(url: string, _options?: ReadUrlOptions): Promise<ReadUrlResponse>;
    readTree(): Promise<ReadTreeResponse>;
    search(url: string): Promise<SearchResponse>;
    toString(): string;
}
