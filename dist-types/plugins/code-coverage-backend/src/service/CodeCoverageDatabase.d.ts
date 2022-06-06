import { Knex } from 'knex';
import { JsonCodeCoverage, JsonCoverageHistory } from './types';
export declare type RawDbCoverageRow = {
    id: string;
    entity: string;
    coverage: string;
};
export interface CodeCoverageStore {
    insertCodeCoverage(coverage: JsonCodeCoverage): Promise<{
        codeCoverageId: string;
    }>;
    getCodeCoverage(entity: string): Promise<JsonCodeCoverage>;
    getHistory(entity: string, limit: number): Promise<JsonCoverageHistory>;
}
export declare class CodeCoverageDatabase implements CodeCoverageStore {
    private readonly db;
    static create(knex: Knex): Promise<CodeCoverageStore>;
    constructor(db: Knex);
    insertCodeCoverage(coverage: JsonCodeCoverage): Promise<{
        codeCoverageId: string;
    }>;
    getCodeCoverage(entity: string): Promise<JsonCodeCoverage>;
    getHistory(entity: string, limit: number): Promise<JsonCoverageHistory>;
}
