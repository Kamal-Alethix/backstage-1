/// <reference types="react" />
import { PipelineHistory } from '../../api/gocdApi.model';
export declare type GoCdBuildsInsightsProps = {
    pipelineHistory: PipelineHistory | undefined;
    loading: boolean;
    error: Error | undefined;
};
export declare const GoCdBuildsInsights: (props: GoCdBuildsInsightsProps) => JSX.Element;
