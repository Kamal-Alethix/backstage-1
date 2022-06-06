import { CompoundEntityRef } from '@backstage/catalog-model';
import { PartialEntity } from '../types';
/**
 * Utility API reference for the {@link CatalogImportApi}.
 *
 * @public
 */
export declare const catalogImportApiRef: import("@backstage/core-plugin-api").ApiRef<CatalogImportApi>;
/**
 * Result of the analysis.
 *
 * @public
 */
export declare type AnalyzeResult = {
    type: 'locations';
    locations: Array<{
        target: string;
        exists?: boolean;
        entities: CompoundEntityRef[];
    }>;
} | {
    type: 'repository';
    url: string;
    integrationType: string;
    generatedEntities: PartialEntity[];
};
/**
 * API for driving catalog imports.
 *
 * @public
 */
export interface CatalogImportApi {
    analyzeUrl(url: string): Promise<AnalyzeResult>;
    preparePullRequest?(): Promise<{
        title: string;
        body: string;
    }>;
    submitPullRequest(options: {
        repositoryUrl: string;
        fileContent: string;
        title: string;
        body: string;
    }): Promise<{
        link: string;
        location: string;
    }>;
}
