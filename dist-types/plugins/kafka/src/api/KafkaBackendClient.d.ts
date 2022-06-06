import { KafkaApi, ConsumerGroupOffsetsResponse } from './types';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
export declare class KafkaBackendClient implements KafkaApi {
    private readonly discoveryApi;
    private readonly identityApi;
    constructor(options: {
        discoveryApi: DiscoveryApi;
        identityApi: IdentityApi;
    });
    private internalGet;
    getConsumerGroupOffsets(clusterId: string, consumerGroup: string): Promise<ConsumerGroupOffsetsResponse>;
}
