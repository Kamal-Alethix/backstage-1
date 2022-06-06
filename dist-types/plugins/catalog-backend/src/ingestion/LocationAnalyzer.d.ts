import { Logger } from 'winston';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { AnalyzeLocationRequest, AnalyzeLocationResponse, LocationAnalyzer } from './types';
export declare class RepoLocationAnalyzer implements LocationAnalyzer {
    private readonly logger;
    private readonly scmIntegrations;
    constructor(logger: Logger, scmIntegrations: ScmIntegrationRegistry);
    analyzeLocation(request: AnalyzeLocationRequest): Promise<AnalyzeLocationResponse>;
}
