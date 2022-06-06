import { CompoundEntityRef } from '@backstage/catalog-model';
export declare type JsonCodeCoverage = {
    metadata: CoverageMetadata;
    entity: CompoundEntityRef;
    files: Array<FileEntry>;
};
export declare type JsonCoverageHistory = {
    entity: CompoundEntityRef;
    history: Array<AggregateCoverage>;
};
export declare type CoverageHistory = {
    line: {
        available: number;
        covered: number;
    };
    branch: BranchHit;
};
export declare type CoverageMetadata = {
    vcs: {
        type: string;
        location: string;
    };
    generationTime: number;
};
export declare type BranchHit = {
    covered: number;
    missed: number;
    available: number;
};
export declare type FileEntry = {
    filename: string;
    lineHits: Record<number, number>;
    branchHits: Record<number, BranchHit>;
};
export declare type AggregateCoverage = {
    timestamp: number;
    line: {
        available: number;
        covered: number;
        missed: number;
        percentage: number;
    };
    branch: {
        available: number;
        covered: number;
        missed: number;
        percentage: number;
    };
};
