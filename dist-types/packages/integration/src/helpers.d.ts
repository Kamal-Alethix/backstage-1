import { ScmIntegration, ScmIntegrationsGroup } from './types';
/** Checks whether the given argument is a valid URL hostname */
export declare function isValidHost(host: string): boolean;
/** Checks whether the given argument is a valid URL */
export declare function isValidUrl(url: string): boolean;
export declare function basicIntegrations<T extends ScmIntegration>(integrations: T[], getHost: (integration: T) => string): ScmIntegrationsGroup<T>;
/**
 * Default implementation of {@link ScmIntegration} `resolveUrl`, that only
 * works with URL pathname based providers.
 *
 * @public
 */
export declare function defaultScmResolveUrl(options: {
    url: string;
    base: string;
    lineNumber?: number;
}): string;
