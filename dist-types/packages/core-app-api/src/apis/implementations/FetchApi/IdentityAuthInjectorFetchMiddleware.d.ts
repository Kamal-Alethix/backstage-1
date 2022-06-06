import { Config } from '@backstage/config';
import { IdentityApi } from '@backstage/core-plugin-api';
import { FetchMiddleware } from './types';
/**
 * A fetch middleware, which injects a Backstage token header when the user is
 * signed in.
 */
export declare class IdentityAuthInjectorFetchMiddleware implements FetchMiddleware {
    readonly identityApi: IdentityApi;
    readonly allowUrl: (url: string) => boolean;
    readonly headerName: string;
    readonly headerValue: (pluginId: string) => string;
    static create(options: {
        identityApi: IdentityApi;
        config?: Config;
        urlPrefixAllowlist?: string[];
        allowUrl?: (url: string) => boolean;
        header?: {
            name: string;
            value: (backstageToken: string) => string;
        };
    }): IdentityAuthInjectorFetchMiddleware;
    constructor(identityApi: IdentityApi, allowUrl: (url: string) => boolean, headerName: string, headerValue: (pluginId: string) => string);
    apply(next: typeof fetch): typeof fetch;
}
