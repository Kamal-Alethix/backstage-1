/// <reference types="node" />
import { Readable } from 'stream';
import { ReadUrlResponse, ReadUrlResponseFactoryFromStreamOptions } from './types';
/**
 * Utility class for UrlReader implementations to create valid ReadUrlResponse
 * instances from common response primitives.
 *
 * @public
 */
export declare class ReadUrlResponseFactory {
    /**
     * Resolves a ReadUrlResponse from a Readable stream.
     */
    static fromReadable(stream: Readable, options?: ReadUrlResponseFactoryFromStreamOptions): Promise<ReadUrlResponse>;
    /**
     * Resolves a ReadUrlResponse from an old-style NodeJS.ReadableStream.
     */
    static fromNodeJSReadable(oldStyleStream: NodeJS.ReadableStream, options?: ReadUrlResponseFactoryFromStreamOptions): Promise<ReadUrlResponse>;
}
