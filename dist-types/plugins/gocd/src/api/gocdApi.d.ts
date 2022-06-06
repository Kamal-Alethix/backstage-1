import { GoCdApiError, PipelineHistory } from './gocdApi.model';
export interface GoCdApi {
    getPipelineHistory(pipelineName: string): Promise<PipelineHistory | GoCdApiError>;
}
