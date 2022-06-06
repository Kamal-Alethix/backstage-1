import { Config } from '@backstage/config';
/**
 * The configuration parameters for a single AWS S3 provider.
 *
 * @public
 */
export declare type AwsS3IntegrationConfig = {
    /**
     * Host, derived from endpoint, and defaults to amazonaws.com
     */
    host: string;
    /**
     * (Optional) AWS Endpoint.
     * The endpoint URI to send requests to. The default endpoint is built from the configured region.
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
     *
     * Supports non-AWS providers, e.g. for LocalStack, endpoint may look like http://localhost:4566
     */
    endpoint?: string;
    /**
     * (Optional) Whether to use path style URLs when communicating with S3.
     * Defaults to false.
     * This allows providers like LocalStack, Minio and Wasabi (and possibly others) to be used.
     */
    s3ForcePathStyle?: boolean;
    /**
     * (Optional) User access key id
     */
    accessKeyId?: string;
    /**
     * (Optional) User secret access key
     */
    secretAccessKey?: string;
    /**
     * (Optional) ARN of role to be assumed
     */
    roleArn?: string;
    /**
     * (Optional) External ID to use when assuming role
     */
    externalId?: string;
};
/**
 * Reads a single Aws S3 integration config.
 *
 * @param config - The config object of a single integration
 * @public
 */
export declare function readAwsS3IntegrationConfig(config: Config): AwsS3IntegrationConfig;
/**
 * Reads a set of AWS S3 integration configs, and inserts some defaults for
 * public Amazon AWS if not specified.
 *
 * @param configs - The config objects of the integrations
 * @public
 */
export declare function readAwsS3IntegrationConfigs(configs: Config[]): AwsS3IntegrationConfig[];
