import { UrlReader } from '@backstage/backend-common';
import { ScmIntegrations } from '@backstage/integration';
/**
 * A helper function that reads the contents of a directory from the given URL.
 * Can be used in your own actions, and also used behind fetch:template and fetch:plain
 *
 * @public
 */
export declare function fetchContents({ reader, integrations, baseUrl, fetchUrl, outputPath, }: {
    reader: UrlReader;
    integrations: ScmIntegrations;
    baseUrl?: string;
    fetchUrl?: string;
    outputPath: string;
}): Promise<void>;
