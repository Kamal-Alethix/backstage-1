import { ScmIntegration, ScmIntegrationsFactory } from '../types';
import { GitHubIntegrationConfig } from './config';
/**
 * A GitHub based integration.
 *
 * @public
 */
export declare class GitHubIntegration implements ScmIntegration {
    private readonly integrationConfig;
    static factory: ScmIntegrationsFactory<GitHubIntegration>;
    constructor(integrationConfig: GitHubIntegrationConfig);
    get type(): string;
    get title(): string;
    get config(): GitHubIntegrationConfig;
    resolveUrl(options: {
        url: string;
        base: string;
        lineNumber?: number;
    }): string;
    resolveEditUrl(url: string): string;
}
/**
 * Takes a GitHub URL and replaces the type part (blob, tree etc).
 *
 * @param url - The original URL
 * @param type - The desired type, e.g. "blob"
 * @public
 */
export declare function replaceGitHubUrlType(url: string, type: 'blob' | 'tree' | 'edit'): string;
