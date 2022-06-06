import { CodeClimateData } from './code-climate-data';
export declare const codeClimateApiRef: import("@backstage/core-plugin-api").ApiRef<CodeClimateApi>;
export interface CodeClimateApi {
    fetchData(repoID: string): Promise<CodeClimateData>;
}
