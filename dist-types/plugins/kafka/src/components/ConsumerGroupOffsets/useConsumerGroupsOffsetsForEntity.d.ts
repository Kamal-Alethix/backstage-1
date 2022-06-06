export declare const useConsumerGroupsOffsetsForEntity: () => readonly [{
    readonly loading: boolean;
    readonly consumerGroupsTopics: {
        clusterId: string;
        consumerGroup: string;
        topics: {
            topic: string;
            partitionId: number;
            topicOffset: string;
            groupOffset: string;
        }[];
    }[] | undefined;
}, {
    readonly retry: (() => void) | (() => void) | (() => void) | (() => void);
}];
