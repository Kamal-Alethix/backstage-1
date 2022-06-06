import { GoCdApi } from './gocdApi';
import { GoCdApiError, PipelineHistory } from './gocdApi.model';
import { DiscoveryApi } from '@backstage/core-plugin-api';
export declare class GoCdClientApi implements GoCdApi {
    private readonly discoveryApi;
    constructor(discoveryApi: DiscoveryApi);
    getPipelineHistory(pipelineName: string): Promise<PipelineHistory | GoCdApiError>;
}
