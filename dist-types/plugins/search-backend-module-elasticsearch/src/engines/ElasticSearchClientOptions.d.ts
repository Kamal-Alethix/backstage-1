/// <reference types="node" />
import type { ConnectionOptions as TLSConnectionOptions } from 'tls';
/**
 * Options used to configure the `@elastic/elasticsearch` client and
 * are what will be passed as an argument to the
 * {@link ElasticSearchSearchEngine.newClient} method
 *
 * They are drawn from the `ClientOptions` class of `@elastic/elasticsearch`,
 * but are maintained separately so that this interface is not coupled to
 *
 * @public
 */
export interface ElasticSearchClientOptions {
    provider?: 'aws' | 'elastic';
    node?: string | string[] | ElasticSearchNodeOptions | ElasticSearchNodeOptions[];
    nodes?: string | string[] | ElasticSearchNodeOptions | ElasticSearchNodeOptions[];
    Transport?: ElasticSearchTransportConstructor;
    Connection?: ElasticSearchConnectionConstructor;
    maxRetries?: number;
    requestTimeout?: number;
    pingTimeout?: number;
    sniffInterval?: number | boolean;
    sniffOnStart?: boolean;
    sniffEndpoint?: string;
    sniffOnConnectionFault?: boolean;
    resurrectStrategy?: 'ping' | 'optimistic' | 'none';
    suggestCompression?: boolean;
    compression?: 'gzip';
    ssl?: TLSConnectionOptions;
    agent?: ElasticSearchAgentOptions | ((opts?: any) => unknown) | false;
    nodeFilter?: (connection: any) => boolean;
    nodeSelector?: ((connections: any[]) => any) | string;
    headers?: Record<string, any>;
    opaqueIdPrefix?: string;
    name?: string | symbol;
    auth?: ElasticSearchAuth;
    proxy?: string | URL;
    enableMetaHeader?: boolean;
    cloud?: {
        id: string;
        username?: string;
        password?: string;
    };
    disablePrototypePoisoningProtection?: boolean | 'proto' | 'constructor';
}
/**
 * @public
 */
export declare type ElasticSearchAuth = {
    username: string;
    password: string;
} | {
    apiKey: string | {
        id: string;
        api_key: string;
    };
};
/**
 * @public
 */
export interface ElasticSearchNodeOptions {
    url: URL;
    id?: string;
    agent?: ElasticSearchAgentOptions;
    ssl?: TLSConnectionOptions;
    headers?: Record<string, any>;
    roles?: {
        master: boolean;
        data: boolean;
        ingest: boolean;
        ml: boolean;
    };
}
/**
 * @public
 */
export interface ElasticSearchAgentOptions {
    keepAlive?: boolean;
    keepAliveMsecs?: number;
    maxSockets?: number;
    maxFreeSockets?: number;
}
/**
 * @public
 */
export interface ElasticSearchConnectionConstructor {
    new (opts?: any): any;
    statuses: {
        ALIVE: string;
        DEAD: string;
    };
    roles: {
        MASTER: string;
        DATA: string;
        INGEST: string;
        ML: string;
    };
}
/**
 * @public
 */
export interface ElasticSearchTransportConstructor {
    new (opts?: any): any;
    sniffReasons: {
        SNIFF_ON_START: string;
        SNIFF_INTERVAL: string;
        SNIFF_ON_CONNECTION_FAULT: string;
        DEFAULT: string;
    };
}
