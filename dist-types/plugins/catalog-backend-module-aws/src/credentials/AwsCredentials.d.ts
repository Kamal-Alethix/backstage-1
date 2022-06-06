import { Credentials } from 'aws-sdk';
import { CredentialsOptions } from 'aws-sdk/lib/credentials';
export declare class AwsCredentials {
    /**
     * If accessKeyId and secretAccessKey are missing, the DefaultAWSCredentialsProviderChain will be used:
     * https://docs.aws.amazon.com/AWSJavaSDK/latest/javadoc/com/amazonaws/auth/DefaultAWSCredentialsProviderChain.html
     */
    static create(config: {
        accessKeyId?: string;
        secretAccessKey?: string;
        roleArn?: string;
    }, roleSessionName: string): Credentials | CredentialsOptions | undefined;
}
