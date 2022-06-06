import { Config } from '@backstage/config';
/**
 * The configuration parameters for a single Google Cloud Storage provider.
 *
 * @public
 */
export declare type GoogleGcsIntegrationConfig = {
    /**
     * Service account email used to authenticate requests.
     */
    clientEmail?: string;
    /**
     * Service account private key used to authenticate requests.
     */
    privateKey?: string;
};
/**
 * Reads a single Google GCS integration config.
 *
 * @param config - The config object of a single integration
 * @public
 */
export declare function readGoogleGcsIntegrationConfig(config: Config): GoogleGcsIntegrationConfig;
