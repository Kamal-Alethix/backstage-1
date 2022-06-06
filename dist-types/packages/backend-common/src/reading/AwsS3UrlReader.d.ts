/// <reference types="node" />
import { S3 } from 'aws-sdk';
import { ReaderFactory, ReadTreeOptions, ReadTreeResponse, ReadTreeResponseFactory, ReadUrlOptions, ReadUrlResponse, SearchResponse, UrlReader } from './types';
import { AwsS3Integration, AwsS3IntegrationConfig } from '@backstage/integration';
/**
 * Path style URLs: https://s3.(region).amazonaws.com/(bucket)/(key)
 * The region can also be on the old form: https://s3-(region).amazonaws.com/(bucket)/(key)
 * Virtual hosted style URLs: https://(bucket).s3.(region).amazonaws.com/(key)
 * See https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#path-style-access
 */
export declare function parseUrl(url: string, config: AwsS3IntegrationConfig): {
    path: string;
    bucket: string;
    region: string;
};
/**
 * Implements a {@link UrlReader} for AWS S3 buckets.
 *
 * @public
 */
export declare class AwsS3UrlReader implements UrlReader {
    private readonly integration;
    private readonly deps;
    static factory: ReaderFactory;
    constructor(integration: AwsS3Integration, deps: {
        s3: S3;
        treeResponseFactory: ReadTreeResponseFactory;
    });
    /**
     * If accessKeyId and secretAccessKey are missing, the standard credentials provider chain will be used:
     * https://docs.aws.amazon.com/AWSJavaSDK/latest/javadoc/com/amazonaws/auth/DefaultAWSCredentialsProviderChain.html
     */
    private static buildCredentials;
    read(url: string): Promise<Buffer>;
    readUrl(url: string, options?: ReadUrlOptions): Promise<ReadUrlResponse>;
    readTree(url: string, options?: ReadTreeOptions): Promise<ReadTreeResponse>;
    search(): Promise<SearchResponse>;
    toString(): string;
}
