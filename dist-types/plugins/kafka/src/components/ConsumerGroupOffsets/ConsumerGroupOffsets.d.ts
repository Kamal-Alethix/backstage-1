/// <reference types="react" />
export declare type TopicPartitionInfo = {
    topic: string;
    partitionId: number;
    topicOffset: string;
    groupOffset: string;
};
declare type Props = {
    loading: boolean;
    retry: () => void;
    clusterId: string;
    consumerGroup: string;
    topics?: TopicPartitionInfo[];
};
export declare const ConsumerGroupOffsets: ({ loading, topics, clusterId, consumerGroup, retry, }: Props) => JSX.Element;
export declare const KafkaTopicsForConsumer: () => JSX.Element;
export {};
