/// <reference types="react" />
import { PipelineHistory } from '../../api/gocdApi.model';
declare type GoCdBuildsProps = {
    goCdBaseUrl: string;
    pipelineHistory: PipelineHistory | undefined;
    loading: boolean;
    error: Error | undefined;
};
export declare const GoCdBuildsTable: (props: GoCdBuildsProps) => JSX.Element;
export {};
