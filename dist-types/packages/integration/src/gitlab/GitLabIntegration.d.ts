import { ScmIntegration, ScmIntegrationsFactory } from '../types';
import { GitLabIntegrationConfig } from './config';
/**
 * A GitLab based integration.
 *
 * @public
 */
export declare class GitLabIntegration implements ScmIntegration {
    private readonly integrationConfig;
    static factory: ScmIntegrationsFactory<GitLabIntegration>;
    constructor(integrationConfig: GitLabIntegrationConfig);
    get type(): string;
    get title(): string;
    get config(): GitLabIntegrationConfig;
    resolveUrl(options: {
        url: string;
        base: string;
        lineNumber?: number;
    }): string;
    resolveEditUrl(url: string): string;
}
/**
 * Takes a GitLab URL and replaces the type part (blob, tree etc).
 *
 * @param url - The original URL
 * @param type - The desired type, e.g. 'blob', 'tree', 'edit'
 * @public
 */
export declare function replaceGitLabUrlType(url: string, type: 'blob' | 'tree' | 'edit'): string;
