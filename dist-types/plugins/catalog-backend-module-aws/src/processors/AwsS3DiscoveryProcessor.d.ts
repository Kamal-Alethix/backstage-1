import { UrlReader } from '@backstage/backend-common';
import { CatalogProcessor, CatalogProcessorEmit, CatalogProcessorParser, LocationSpec } from '@backstage/plugin-catalog-backend';
/**
 * A processor for automatic discovery of entities from S3 buckets. Handles the
 * `s3-discovery` location type, and target bucket URLs e.g. on the form
 * `https://testbucket.s3.us-east-2.amazonaws.com`.
 *
 * @public
 */
export declare class AwsS3DiscoveryProcessor implements CatalogProcessor {
    private readonly reader;
    constructor(reader: UrlReader);
    getProcessorName(): string;
    readLocation(location: LocationSpec, optional: boolean, emit: CatalogProcessorEmit, parser: CatalogProcessorParser): Promise<boolean>;
    private doRead;
}
