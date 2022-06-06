import { Request } from 'express';
import { UrlReader } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { ScmIntegration, ScmIntegrations } from '@backstage/integration';
import { AggregateCoverage, FileEntry, JsonCodeCoverage } from './types';
export declare const calculatePercentage: (available: number, covered: number) => number;
export declare const aggregateCoverage: (c: JsonCodeCoverage) => AggregateCoverage;
export declare class CoverageUtils {
    readonly scm: Partial<ScmIntegrations>;
    readonly urlReader: Partial<UrlReader>;
    constructor(scm: Partial<ScmIntegrations>, urlReader: Partial<UrlReader>);
    processCoveragePayload(entity: Entity, req: Request): Promise<{
        sourceLocation?: string;
        vcs?: ScmIntegration;
        scmFiles: string[];
        body: {};
    }>;
    buildCoverage(entity: Entity, sourceLocation: string | undefined, vcs: ScmIntegration | undefined, files: FileEntry[]): Promise<JsonCodeCoverage>;
    validateRequestBody(req: Request): any;
}
