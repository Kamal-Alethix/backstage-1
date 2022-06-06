import { Logger } from 'winston';
import { SaslConfig, SslConfig } from '../types/types';
export declare type PartitionOffset = {
    id: number;
    offset: string;
};
export declare type TopicOffset = {
    topic: string;
    partitions: PartitionOffset[];
};
export declare type Options = {
    clientId: string;
    brokers: string[];
    ssl?: SslConfig;
    sasl?: SaslConfig;
    logger: Logger;
};
export interface KafkaApi {
    fetchTopicOffsets(topic: string): Promise<Array<PartitionOffset>>;
    fetchGroupOffsets(groupId: string): Promise<Array<TopicOffset>>;
}
export declare class KafkaJsApiImpl implements KafkaApi {
    private readonly kafka;
    private readonly logger;
    constructor(options: Options);
    fetchTopicOffsets(topic: string): Promise<Array<PartitionOffset>>;
    fetchGroupOffsets(groupId: string): Promise<Array<TopicOffset>>;
    private static toPartitionOffsets;
}
