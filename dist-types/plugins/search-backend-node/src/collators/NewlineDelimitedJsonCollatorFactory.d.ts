/// <reference types="node" />
import { UrlReader } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { Permission } from '@backstage/plugin-permission-common';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import { Readable } from 'stream';
import { Logger } from 'winston';
/**
 * Options for instansiate NewlineDelimitedJsonCollatorFactory
 * @public
 */
export declare type NewlineDelimitedJsonCollatorFactoryOptions = {
    type: string;
    searchPattern: string;
    reader: UrlReader;
    logger: Logger;
    visibilityPermission?: Permission;
};
/**
 * Factory class producing a collator that can be used to index documents
 * sourced from the latest newline delimited JSON file matching a given search
 * pattern. "Latest" is determined by the name of the file (last alphabetically
 * is considered latest).
 *
 * @remarks
 * The reader provided must implement the `search()` method as well as the
 * `readUrl` method whose response includes the `stream()` method. Naturally,
 * the reader must also be configured to understand the given search pattern.
 *
 * @example
 * Here's an example configuration using Google Cloud Storage, which would
 * return the latest file under the `bucket` GCS bucket with files like
 * `xyz-2021.ndjson` or `xyz-2022.ndjson`.
 * ```ts
 * indexBuilder.addCollator({
 *   schedule,
 *   factory: NewlineDelimitedJsonCollatorFactory.fromConfig(env.config, {
 *     type: 'techdocs',
 *     searchPattern: 'https://storage.cloud.google.com/bucket/xyz-*',
 *     reader: env.reader,
 *     logger: env.logger,
 *   })
 * });
 * ```
 *
 * @public
 */
export declare class NewlineDelimitedJsonCollatorFactory implements DocumentCollatorFactory {
    private readonly searchPattern;
    private readonly reader;
    private readonly logger;
    readonly type: string;
    readonly visibilityPermission: Permission | undefined;
    private constructor();
    /**
     * Returns a NewlineDelimitedJsonCollatorFactory instance from configuration
     * and a set of options.
     */
    static fromConfig(_config: Config, options: NewlineDelimitedJsonCollatorFactoryOptions): NewlineDelimitedJsonCollatorFactory;
    /**
     * Returns the "latest" URL for the given search pattern (e.g. the one at the
     * end of the list, sorted alphabetically).
     */
    private lastUrl;
    getCollator(): Promise<Readable>;
}
