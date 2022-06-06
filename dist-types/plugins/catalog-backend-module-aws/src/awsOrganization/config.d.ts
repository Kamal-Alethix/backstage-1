import { Config } from '@backstage/config';
/**
 * The configuration parameters for a single AWS Organization Processor
 */
export declare type AwsOrganizationProviderConfig = {
    /**
     * The role to assume for the processor.
     */
    roleArn?: string;
};
export declare function readAwsOrganizationConfig(config: Config): AwsOrganizationProviderConfig;
