import { ConfigReader } from '@backstage/config';
import { OptionValues } from 'commander';
/**
 * Helper when working with publisher-related configurations.
 */
export declare class PublisherConfig {
    /**
     * Maps publisher-specific config keys to config getters.
     */
    private static configFactories;
    /**
     * Returns Backstage config suitable for use when instantiating a Publisher. If
     * there are any missing or invalid options provided, an error is thrown.
     *
     * Note: This assumes that proper credentials are set in Environment
     * variables for the respective GCS/AWS clients to work.
     */
    static getValidConfig(opts: OptionValues): ConfigReader;
    /**
     * Typeguard to ensure the publisher has a known config getter.
     */
    private static isKnownPublisher;
    /**
     * Retrieve valid AWS S3 configuration based on the command.
     */
    private static getValidAwsS3Config;
    /**
     * Retrieve valid Azure Blob Storage configuration based on the command.
     */
    private static getValidAzureConfig;
    /**
     * Retrieve valid GCS configuration based on the command.
     */
    private static getValidGoogleGcsConfig;
    /**
     * Retrieves valid OpenStack Swift configuration based on the command.
     */
    private static getValidOpenStackSwiftConfig;
}
