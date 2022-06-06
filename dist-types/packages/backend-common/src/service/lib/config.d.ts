import { Config } from '@backstage/config';
import { CorsOptions } from 'cors';
export declare type BaseOptions = {
    listenPort?: string | number;
    listenHost?: string;
};
export declare type HttpsSettings = {
    certificate: CertificateGenerationOptions | CertificateReferenceOptions;
};
export declare type CertificateReferenceOptions = {
    key: string;
    cert: string;
};
export declare type CertificateGenerationOptions = {
    hostname: string;
};
export declare type CertificateAttributes = {
    commonName: string;
};
/**
 * A map from CSP directive names to their values.
 */
export declare type CspOptions = Record<string, string[]>;
/**
 * Reads some base options out of a config object.
 *
 * @param config - The root of a backend config object
 * @returns A base options object
 *
 * @example
 * ```json
 * {
 *   baseUrl: "http://localhost:7007",
 *   listen: "0.0.0.0:7007"
 * }
 * ```
 */
export declare function readBaseOptions(config: Config): BaseOptions;
/**
 * Attempts to read a CORS options object from the root of a config object.
 *
 * @param config - The root of a backend config object
 * @returns A CORS options object, or undefined if not specified
 *
 * @example
 * ```json
 * {
 *   cors: {
 *    origin: "http://localhost:3000",
 *    credentials: true
 *   }
 * }
 * ```
 */
export declare function readCorsOptions(config: Config): CorsOptions | undefined;
/**
 * Attempts to read a CSP options object from the root of a config object.
 *
 * @param config - The root of a backend config object
 * @returns A CSP options object, or undefined if not specified. Values can be
 *          false as well, which means to remove the default behavior for that
 *          key.
 *
 * @example
 * ```yaml
 * backend:
 *   csp:
 *     connect-src: ["'self'", 'http:', 'https:']
 *     upgrade-insecure-requests: false
 * ```
 */
export declare function readCspOptions(config: Config): Record<string, string[] | false> | undefined;
/**
 * Attempts to read a https settings object from the root of a config object.
 *
 * @param config - The root of a backend config object
 * @returns A https settings object, or undefined if not specified
 *
 * @example
 * ```json
 * {
 *   https: {
 *    certificate: ...
 *   }
 * }
 * ```
 */
export declare function readHttpsSettings(config: Config): HttpsSettings | undefined;
