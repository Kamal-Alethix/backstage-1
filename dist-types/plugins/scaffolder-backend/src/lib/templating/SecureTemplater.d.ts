import { JsonValue } from '@backstage/types';
import { RepoSpec } from '../../scaffolder/actions/builtin/publish/util';
/** @public */
export declare type TemplateFilter = (...args: JsonValue[]) => JsonValue | undefined;
export interface SecureTemplaterOptions {
    parseRepoUrl?(repoUrl: string): RepoSpec;
    cookiecutterCompat?: boolean;
    additionalTemplateFilters?: Record<string, TemplateFilter>;
}
export declare type SecureTemplateRenderer = (template: string, values: unknown) => string;
export declare class SecureTemplater {
    static loadRenderer(options?: SecureTemplaterOptions): Promise<SecureTemplateRenderer>;
}
