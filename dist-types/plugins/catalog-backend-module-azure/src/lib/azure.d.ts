import { AzureIntegrationConfig } from '@backstage/integration';
export interface CodeSearchResponse {
    count: number;
    results: CodeSearchResultItem[];
}
export interface CodeSearchResultItem {
    fileName: string;
    path: string;
    repository: {
        name: string;
    };
}
export declare function codeSearch(azureConfig: AzureIntegrationConfig, org: string, project: string, repo: string, path: string): Promise<CodeSearchResultItem[]>;
