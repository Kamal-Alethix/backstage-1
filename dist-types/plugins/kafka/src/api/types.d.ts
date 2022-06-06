export declare const kafkaApiRef: import("@backstage/core-plugin-api").ApiRef<KafkaApi>;
export declare type ConsumerGroupOffsetsResponse = {
    consumerId: string;
    offsets: {
        topic: string;
        partitionId: number;
        topicOffset: string;
        groupOffset: string;
    }[];
};
export interface KafkaApi {
    getConsumerGroupOffsets(clusterId: string, consumerGroup: string): Promise<ConsumerGroupOffsetsResponse>;
}
