import { CompoundEntityRef } from '@backstage/catalog-model';
import { JsonCodeCoverage, JsonCoverageHistory } from './types';
import { DiscoveryApi } from '@backstage/core-plugin-api';
export declare type CodeCoverageApi = {
    discovery: DiscoveryApi;
    getCoverageForEntity: (entity: CompoundEntityRef) => Promise<JsonCodeCoverage>;
    getFileContentFromEntity: (entity: CompoundEntityRef, filePath: string) => Promise<string>;
    getCoverageHistoryForEntity: (entity: CompoundEntityRef, limit?: number) => Promise<JsonCoverageHistory>;
};
export declare const codeCoverageApiRef: import("@backstage/core-plugin-api").ApiRef<CodeCoverageApi>;
export declare class CodeCoverageRestApi implements CodeCoverageApi {
    discovery: DiscoveryApi;
    url: string;
    constructor(discovery: DiscoveryApi);
    private fetch;
    getCoverageForEntity(entityName: CompoundEntityRef): Promise<JsonCodeCoverage>;
    getFileContentFromEntity(entityName: CompoundEntityRef, filePath: string): Promise<string>;
    getCoverageHistoryForEntity(entityName: CompoundEntityRef, limit?: number): Promise<JsonCoverageHistory>;
}
